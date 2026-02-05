import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ArticleGrid } from "@/components/home/ArticleGrid";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col selection:bg-accent/20 selection:text-ink">
      <Navbar />
      <div className="flex-1">
        <HeroSection />
        <ArticleGrid />
      </div>
      <Footer />
    </main>
  );
}
