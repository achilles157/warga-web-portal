"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Article, getPublishedArticles } from "@/lib/services/articleService";
import { ArrowUpRight, Clock } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface ArticleGridProps {
    specificArticles?: Article[];
}

export function ArticleGrid({ specificArticles }: ArticleGridProps) {
    const [articles, setArticles] = useState<Article[]>(specificArticles || []);
    const [loading, setLoading] = useState(!specificArticles);

    useEffect(() => {
        if (specificArticles) {
            setArticles(specificArticles);
            setLoading(false);
            return;
        }

        async function fetch() {
            try {
                const data = await getPublishedArticles();
                setArticles(data);
            } catch (error) {
                console.error("Failed to load articles", error);
            } finally {
                setLoading(false);
            }
        }
        fetch();
    }, [specificArticles]);

    if (loading) return <div className="py-20 text-center text-neutral-400">Memuat kabar terbaru...</div>;

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex items-end justify-between mb-12">
                    <h2 className="font-display text-4xl font-bold text-ink">Terbaru</h2>
                    <Link href="/archives" className="text-sm font-medium border-b border-ink pb-0.5 hover:text-neutral-600 hover:border-neutral-600 transition-colors">
                        Lihat Arsip
                    </Link>
                </div>

                {articles.length === 0 ? (
                    <div className="text-center py-12 bg-neutral-50 rounded-xl">
                        <p className="text-neutral-500">Belum ada artikel yang terbit.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((doc, idx) => (
                            <motion.article
                                key={doc.id}
                                className="group flex flex-col h-full border-b border-neutral-100 pb-8 md:border-none"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                            >
                                <div className="aspect-[4/3] bg-neutral-100 rounded-lg overflow-hidden mb-6 relative">
                                    {doc.meta.cover_image ? (
                                        <Image
                                            src={doc.meta.cover_image}
                                            alt={doc.meta.title}
                                            fill
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-neutral-200 group-hover:scale-105 transition-transform duration-700 ease-out flex items-center justify-center text-neutral-400 font-display text-2xl">
                                            {doc.meta.title.charAt(0)}
                                        </div>
                                    )}

                                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md text-ink z-10">
                                        {doc.meta.tags?.[0] || "Umum"}
                                    </span>
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <div className="flex items-center text-xs text-neutral-500 mb-3 space-x-2">
                                        <Link href={`/author/${doc.editorial.author_id}`} className="font-medium text-ink hover:text-primary transition-colors z-10 relative">
                                            {doc.editorial.author_name}
                                        </Link>
                                        <span>•</span>
                                        <span>
                                            {doc.editorial.published_at
                                                ? format(doc.editorial.published_at.toDate(), "d MMM yyyy", { locale: idLocale })
                                                : "Draft"}
                                        </span>
                                    </div>
                                    <h3 className="font-display text-2xl font-bold mb-3 leading-snug group-hover:text-primary transition-colors">
                                        <Link href={`/read/${doc.meta.slug}`}>
                                            {doc.meta.title}
                                        </Link>
                                    </h3>
                                    <p className="text-neutral-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                                        {doc.meta.subtitle}
                                    </p>
                                    <Link href={`/read/${doc.meta.slug}`} className="inline-flex items-center text-sm font-bold underline decoration-neutral-300 underline-offset-4 group-hover:decoration-primary transition-all">
                                        Baca
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
