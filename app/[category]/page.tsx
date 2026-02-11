import { getArticlesByTag } from "@/lib/services/articleService";
import { ArticleGrid } from "@/components/home/ArticleGrid";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { notFound } from "next/navigation";

export const revalidate = 3600; // ISR: Revalidate every hour

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
                    <div className="-mt-20"> {/* Negative margin to offset ArticleGrid's top padding if needed, or just let it be. ArticleGrid has py-20. */}
                        <ArticleGrid specificArticles={articles} hideHeader={true} />
                    </div>
                ) : (
                    <div className="py-20 text-center bg-neutral-50 rounded-xl border border-neutral-100">
                        <p className="text-neutral-500 text-lg">
                            Belum ada artikel di kategori <span className="font-bold">{dbTag}</span>.
                        </p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
