import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ArticleGrid } from "@/components/home/ArticleGrid";
import { getPublishedArticles, getWeeklyPicks, getArticlesByIds } from "@/lib/services/articleService";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function Home() {
  // 1. Try to fetch Weekly Picks settings
  const weeklyPicksSettings = await getWeeklyPicks();

  let articles: any[] = [];

  if (weeklyPicksSettings && weeklyPicksSettings.featured_article_ids.length > 0) {
    // 2. If valid picks exist, fetch those specific articles
    articles = await getArticlesByIds(weeklyPicksSettings.featured_article_ids);
  } else {
    // 3. Fallback to latest published articles if no picks are set
    articles = await getPublishedArticles();
  }

  // The first article is the Featured Hero
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  // The rest are the grid
  const gridArticles = articles.length > 1 ? articles.slice(1) : [];

  return (
    <main className="min-h-screen flex flex-col selection:bg-accent/20 selection:text-ink">
      <Navbar />
      <div className="flex-1">
        <HeroSection article={featuredArticle} />
        {/* If we only have 1 article (the hero), grid might be empty. That's fine. 
            Or maybe we want to always show latest in grid? 
            The user said "Weekly Picks" -> imply curation. 
            If I only pick 2 articles, 1 is hero, 1 is grid. Seems correct. */}
        <ArticleGrid specificArticles={gridArticles} />
      </div>
      <Footer />
    </main>
  );
}
