import { getArticlesByTag } from "@/lib/services/articleService";
import { ArticleGrid } from "@/components/home/ArticleGrid";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { notFound } from "next/navigation";

// Map URL slug to Database Tag (Case Sensitive)
const CATEGORY_MAP: Record<string, string> = {
    "investigasi": "Investigasi",
    "opini": "Opini",
    "sejarah": "Sejarah"
};

const CATEGORY_DESC: Record<string, string> = {
    "investigasi": "Laporan mendalam yang mengungkap fakta tersembunyi.",
    "opini": "Perspektif kritis warga terhadap isu terkini.",
    "sejarah": "Melawan lupa, merawat ingatan kolektif."
};

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;

    const dbTag = CATEGORY_MAP[category.toLowerCase()];

    if (!dbTag) {
        notFound();
    }

    const articles = await getArticlesByTag(dbTag);

    return (
        <main className="min-h-screen flex flex-col selection:bg-accent/20 selection:text-ink">
            <Navbar />

            <div className="flex-1 container mx-auto px-6 py-24">
                <header className="mb-12 border-b border-neutral-200 pb-8">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">
                        Kategori
                    </span>
                    <h1 className="font-display font-bold text-4xl md:text-5xl mb-4 capitalize">
                        {category}
                    </h1>
                    <p className="text-xl text-neutral-500 font-serif italic max-w-2xl">
                        {CATEGORY_DESC[category.toLowerCase()] || "Kumpulan artikel pilihan editor."}
                    </p>
                </header>

                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map(article => (
                            <ArticleGrid key={article.id} specificArticles={[article]} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-neutral-50 rounded-xl border border-neutral-100">
                        <p className="text-neutral-500 text-lg">
                            Belum ada artikel di kategori <span className="font-bold">{dbTag}</span>.
                        </p>
                    </div>
                )}

                {/* Note: Reuse ArticleGrid logic but we might need to refactor ArticleGrid to accept props 
                    Currently ArticleGrid fetches its own data. 
                    Let's check ArticleGrid first. If it fetches its own data, I should probably create a simpler ArticleCard 
                    or refactor ArticleGrid to accept `articles` prop.
                */}
            </div>

            <Footer />
        </main>
    );
}
