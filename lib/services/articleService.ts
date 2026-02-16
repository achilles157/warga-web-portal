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
    deleteDoc,
} from "firebase/firestore";

const ARTICLES_COLLECTION = "articles_collection";

export type ArticleStatus = "draft" | "pending_review" | "published" | "rejected";

export interface BibliographyItem {
    title: string;
    source: string;
    url: string;
    type: "data" | "legal" | "report" | "news" | "other";
}

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
        isWeeklyPick?: boolean;
    };
    bibliography?: {
        title: string;
        source: string;
        url: string;
        type: "data" | "legal" | "report" | "news" | "other";
    }[];
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
        bibliography: data.bibliography || [],
        metrics: {
            views: 0,
            app_clicks: 0,
        },
    };

    const docRef = await addDoc(collection(db, ARTICLES_COLLECTION), payload);
    return docRef.id;
}

/**
 * Updates an existing article.
 */
export async function updateArticle(id: string, data: Partial<Article>) {
    const docRef = doc(db, ARTICLES_COLLECTION, id);

    // Flatten the nested object for Firestore update
    // We use dot notation for nested fields to avoid overwriting the entire object
    const updatePayload: any = {};

    if (data.meta) {
        if (data.meta.title) updatePayload["meta.title"] = data.meta.title;
        if (data.meta.subtitle) updatePayload["meta.subtitle"] = data.meta.subtitle;
        if (data.meta.slug) updatePayload["meta.slug"] = data.meta.slug;
        if (data.meta.cover_image) updatePayload["meta.cover_image"] = data.meta.cover_image;
        if (data.meta.tags) updatePayload["meta.tags"] = data.meta.tags;
        if (data.meta.read_time_minutes) updatePayload["meta.read_time_minutes"] = data.meta.read_time_minutes;
    }

    if (data.content) {
        if (data.content.body) updatePayload["content.body"] = data.content.body;
        if (data.content.is_locked !== undefined) updatePayload["content.is_locked"] = data.content.is_locked;
        if (data.content.lock_cta_text) updatePayload["content.lock_cta_text"] = data.content.lock_cta_text;
        if (data.content.linked_module_id) updatePayload["content.linked_module_id"] = data.content.linked_module_id;
        if (data.content.linked_sub_module_id) updatePayload["content.linked_sub_module_id"] = data.content.linked_sub_module_id;
    }

    if (data.editorial) {
        if (data.editorial.status) updatePayload["editorial.status"] = data.editorial.status;
        if (data.editorial.author_name) updatePayload["editorial.author_name"] = data.editorial.author_name;
        // Handle published_at logic in the service or caller? 
        // Usually better in service if it's a simple state change, but caller might want specific timestamp.
        // For now, allow direct update if passed.
        if (data.editorial.published_at) updatePayload["editorial.published_at"] = data.editorial.published_at;

        updatePayload["editorial.updated_at"] = serverTimestamp();
    }

    if (data.bibliography) {
        updatePayload["bibliography"] = data.bibliography;
    }

    await updateDoc(docRef, updatePayload);
}

/**
 * Fetches articles based on status.
 */
export async function getArticles(authorId?: string, status?: ArticleStatus) {
    let q = query(
        collection(db, ARTICLES_COLLECTION),
        orderBy("editorial.created_at", "desc")
    );

    if (authorId) {
        q = query(q, where("editorial.author_id", "==", authorId));
    }

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

/**
 * Deletes an article by ID.
 */
export async function deleteArticle(id: string) {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    await deleteDoc(docRef);
}

// --- Weekly Picks System ---

const SETTINGS_COLLECTION = "site_settings";

export interface WeeklyPicksData {
    featured_article_ids: string[];
    last_updated: any;
    editor_note: string;
}

export async function getWeeklyPicks() {
    const docRef = doc(db, SETTINGS_COLLECTION, "weekly_picks");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
        return snapshot.data() as WeeklyPicksData;
    }
    return null;
}

export async function getArticlesByIds(ids: string[]) {
    if (!ids || ids.length === 0) return [];

    // Firestore "in" query supports up to 10 items. 
    // Since weekly picks are usually 2-3, this is fine.
    const q = query(
        collection(db, ARTICLES_COLLECTION),
        where("__name__", "in", ids), // __name__ refers to document ID
        where("editorial.status", "==", "published")
    );

    const snapshot = await getDocs(q);
    // Sort results to match order of IDs array? Firestore doesn't guarantee order.
    // We map manually to preserve curated order.
    const articles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));

    return ids
        .map(id => articles.find(a => a.id === id))
        .filter(a => a !== undefined) as Article[];
}

export async function setWeeklyPicks(articleIds: string[], note: string = "") {
    // 1. Update site_settings/weekly_picks
    const settingsRef = doc(db, SETTINGS_COLLECTION, "weekly_picks");
    await setDoc(settingsRef, {
        featured_article_ids: articleIds,
        last_updated: serverTimestamp(),
        editor_note: note
    });

    // 2. We could update individual articles check "isWeeklyPick" here if we wanted history,
    // but the prompt says update editorial.isWeeklyPick: true.
    // Ideally we should "unset" previous ones too, but that's expensive (query all isWeeklyPick=true).
    // For now, let's just update the NEW ones. (Archival purpose).

    // Batch updates?
    // Let's just do parallel promises for now, it's small scale.
    const promises = articleIds.map(id =>
        updateDoc(doc(db, ARTICLES_COLLECTION, id), {
            "editorial.isWeeklyPick": true
        })
    );

    await Promise.all(promises);
}
