import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ArticleGrid } from "@/components/home/ArticleGrid";
import { getPublishedArticles } from "@/lib/services/articleService";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function Home() {
  const articles = await getPublishedArticles();

  return (
    <main className="min-h-screen flex flex-col selection:bg-accent/20 selection:text-ink">
      <Navbar />
      <div className="flex-1">
        <HeroSection />
        <ArticleGrid specificArticles={articles} />
      </div>
      <Footer />
    </main>
  );
}
