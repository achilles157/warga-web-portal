import { getArticleBySlug } from "@/lib/services/articleService";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { AppLockCard } from "@/components/article/AppLockCard";
import { BibliographySection } from "@/components/article/BibliographySection";
import { cn } from "@/lib/utils";

import { Metadata } from "next";

export const revalidate = 60; // ISR every 60 seconds

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) return { title: "Artikel Tidak Ditemukan" };

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wargadaily.com";
    const articleUrl = `${baseUrl}/read/${slug}`;
    const cleanDescription = article.meta.subtitle || article.content.body.substring(0, 150).replace(/[#*`]/g, "") + "...";

    return {
        title: article.meta.title,
        description: cleanDescription,
        keywords: article.meta.tags || ["Berita", "Warga Daily", "Jurnalisme Warga"],
        authors: [{ name: article.editorial.author_name, url: `${baseUrl}/author/${article.editorial.author_id}` }],
        publisher: "Warga Daily",
        alternates: {
            canonical: articleUrl,
        },
        openGraph: {
            title: article.meta.title,
            description: cleanDescription,
            url: articleUrl,
            siteName: "Warga Daily",
            locale: "id_ID",
            type: "article",
            publishedTime: article.editorial.published_at?.toDate().toISOString(),
            authors: [article.editorial.author_name],
            tags: article.meta.tags,
            images: article.meta.cover_image ? [
                {
                    url: article.meta.cover_image,
                    width: 1200,
                    height: 630,
                    alt: article.meta.title,
                }
            ] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: article.meta.title,
            description: cleanDescription,
            images: article.meta.cover_image ? [article.meta.cover_image] : [],
            creator: "@wargadaily", // Optional: Update if they have a handle
            site: "@wargadaily",
        },
    };
}

export default async function ReadArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-paper pb-20">
            {/* Navigation */}
            <nav className="sticky top-0 z-10 bg-paper/90 backdrop-blur-md border-b border-neutral-100 py-4">
                <div className="container mx-auto px-6 flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-ink">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8">
                            <Image
                                src="/images/new_logo.png"
                                alt="Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-display font-bold text-lg tracking-tight">Warga Daily.</span>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 max-w-3xl mt-12">
                {/* Header */}
                <header className="mb-10 text-center">
                    {article.meta.tags?.[0] && (
                        <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                            {article.meta.tags[0]}
                        </span>
                    )}
                    <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight text-ink mb-6">
                        {article.meta.title}
                    </h1>
                    {article.meta.subtitle && (
                        <p className="text-xl text-neutral-600 font-sans italic mb-8">
                            {article.meta.subtitle}
                        </p>
                    )}

                    {/* Meta */}
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-500 font-medium">
                        <Link href={`/author/${article.editorial.author_id}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                            <User size={16} />
                            <span>{article.editorial.author_name}</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>
                                {article.editorial.published_at
                                    ? format(article.editorial.published_at.toDate(), "d MMMM yyyy", { locale: idLocale })
                                    : "Draft"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{article.meta.read_time_minutes || 5} Menit Baca</span>
                        </div>
                    </div>
                </header>

                {/* Cover Image */}
                {article.meta.cover_image && (
                    <div className="mb-12 rounded-xl overflow-hidden shadow-sm aspect-video relative">
                        <Image
                            src={article.meta.cover_image}
                            alt={article.meta.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 800px"
                        />
                    </div>
                )}

                {/* Content */}
                <div className={cn(
                    "prose prose-lg prose-neutral max-w-none font-sans text-ink leading-relaxed relative",
                    article.content.is_locked && "pb-32" // Extra padding for the overlay
                )}>
                    {/* Hybrid Rendering: Check if content looks like HTML (starts with <) */}
                    {article.content.body.trim().startsWith('<') ? (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: article.content.is_locked
                                    ? article.content.body.split('</p>').slice(0, 3).join('</p>') + '</p>' // Simple truncation for HTML
                                    : article.content.body
                            }}
                        />
                    ) : (
                        <ReactMarkdown
                            components={{
                                img: (props) => (
                                    <span className="block my-8">
                                        <img {...props} className="rounded-lg w-full" />
                                        {props.alt && <span className="block text-center text-sm text-neutral-500 mt-2 italic">{props.alt}</span>}
                                    </span>
                                )
                            }}
                        >
                            {article.content.is_locked
                                ? article.content.body.split('\n\n').slice(0, 3).join('\n\n') // Show first 3 paragraphs
                                : article.content.body}
                        </ReactMarkdown>
                    )}

                    {/* Gradient Fade for Locked Content */}
                    {article.content.is_locked && (
                        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-paper to-transparent pointer-events-none" />
                    )}
                </div>

                {/* Bibliography Section */}
                <BibliographySection items={article.bibliography || []} />

                {/* Locked Content Overlay */}
                {article.content.is_locked && (
                    <AppLockCard
                        moduleId={article.content.linked_module_id || "general"}
                        subModuleId={article.content.linked_sub_module_id}
                        ctaText={article.content.lock_cta_text}
                    />
                )}
            </div>
        </article>
    );
}
