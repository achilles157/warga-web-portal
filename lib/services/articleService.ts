import { db } from "@/lib/firebase";
import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    addDoc,
} from "firebase/firestore";

const ARTICLES_COLLECTION = "articles_collection";

export type ArticleStatus = "draft" | "pending_review" | "published" | "rejected";

export interface Article {
    id?: string;
    meta: {
        slug: string;
        title: string;
        subtitle: string;
        cover_image: string;
        tags: string[];
        read_time_minutes: number;
    };
    content: {
        body: string;
        is_locked: boolean;
        locked_from_paragraph?: number;
        lock_cta_text?: string;
        linked_module_id?: string;
        linked_sub_module_id?: string;
    };
    editorial: {
        author_id: string;
        author_name: string;
        status: ArticleStatus;
        created_at?: any;
        updated_at?: any;
        published_at?: any;
        reviewer_id?: string | null;
        rejection_reason?: string | null;
    };
    metrics?: {
        views: number;
        app_clicks: number;
    };
}

/**
 * Creates a new draft article.
 */
export async function createArticle(
    authorId: string,
    authorName: string,
    data: Partial<Article>
) {
    const payload: Omit<Article, "id"> = {
        meta: {
            slug: data.meta?.slug || "",
            title: data.meta?.title || "Untitled Draft",
            subtitle: data.meta?.subtitle || "",
            cover_image: data.meta?.cover_image || "",
            tags: data.meta?.tags || [],
            read_time_minutes: 0,
        },
        content: {
            body: data.content?.body || "",
            is_locked: data.content?.is_locked || false,
        },
        editorial: {
            author_id: authorId,
            author_name: authorName,
            status: "draft",
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            published_at: null,
        },
        metrics: {
            views: 0,
            app_clicks: 0,
        },
    };

    const docRef = await addDoc(collection(db, ARTICLES_COLLECTION), payload);
    return docRef.id;
}

/**
 * Fetches articles based on status.
 */
export async function getArticles(status?: ArticleStatus) {
    let q = query(
        collection(db, ARTICLES_COLLECTION),
        orderBy("editorial.created_at", "desc")
    );

    if (status) {
        q = query(q, where("editorial.status", "==", status));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Article));
}

/**
 * Fetches proper articles for public feed (published only).
 */
export async function getPublishedArticles() {
    const q = query(
        collection(db, ARTICLES_COLLECTION),
        where("editorial.status", "==", "published"),
        orderBy("editorial.published_at", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Article));
}

/**
 * Fetches a single article by Slug.
 */
export async function getArticleBySlug(slug: string) {
    const q = query(
        collection(db, ARTICLES_COLLECTION),
        where("meta.slug", "==", slug),
        where("editorial.status", "==", "published"), // Only published
        orderBy("editorial.published_at", "desc"), // In case of duplicate slugs, take latest
        limit(1)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Article;
    }
    return null;
}

/**
 * Fetches articles by Author.
 */
export async function getArticlesByAuthor(authorId: string) {
    const q = query(
        collection(db, ARTICLES_COLLECTION),
        where("editorial.author_id", "==", authorId),
        where("editorial.status", "==", "published"),
        orderBy("editorial.published_at", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Article));
}

/**
 * Fetches a single article by ID.
 */
export async function getArticleById(id: string) {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Article;
    }
    return null;
}

/**
 * Fetches articles by Tag (Category).
 */
export async function getArticlesByTag(tag: string) {
    const q = query(
        collection(db, ARTICLES_COLLECTION),
        where("meta.tags", "array-contains", tag),
        where("editorial.status", "==", "published"),
        orderBy("editorial.published_at", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Article));
}
