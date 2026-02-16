"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection({ article }: { article?: any }) {
    if (!article) return null;

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="inline-block py-1 px-3 border border-neutral-200 rounded-full text-xs font-semibold tracking-wide uppercase text-neutral-500 mb-6 bg-white">
                            Laporan Utama Minggu Ini
                        </span>
                    </motion.div>

                    <motion.h1
                        className="font-display text-5xl md:text-7xl font-bold leading-tight mb-8 text-ink"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    >
                        {article.meta.title}
                    </motion.h1>

                    <motion.p
                        className="text-lg md:text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        {article.meta.subtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="flex justify-center"
                    >
                        <Link
                            href={`/read/${article.meta.slug}`}
                            className="group flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-medium transition-all hover:bg-ink hover:scale-105 shadow-lg shadow-primary/25"
                        >
                            Baca Selengkapnya
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Abstract Background Element with Polish */}
            <div className="absolute top-0 inset-x-0 h-full -z-10 pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-secondary/30 to-transparent rounded-full blur-3xl opacity-60" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-gradient-to-tl from-tertiary/30 to-transparent rounded-full blur-3xl opacity-60" />
            </div>
        </section>
    );
}
