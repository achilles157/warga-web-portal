"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface BibliographyItem {
    title: string;
    url: string;
}

interface BibliographySectionProps {
    items: BibliographyItem[];
}

export function BibliographySection({ items }: BibliographySectionProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (!items || items.length === 0) return null;

    return (
        <section className="my-12 border-t border-neutral-200 pt-8">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between group p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-primary shadow-sm">
                        <BookOpen size={14} />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-ink">Daftar Pustaka</h3>
                        <p className="text-xs text-neutral-500 font-medium">
                            {items.length} Referensi & Sumber Data
                        </p>
                    </div>
                </div>
                <ChevronDown
                    size={20}
                    className={cn(
                        "text-neutral-400 transition-transform duration-300",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            <div
                className={cn(
                    "grid transition-all duration-300 ease-out overflow-hidden",
                    isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                )}
            >
                <div className="min-h-0">
                    <ul className="space-y-3 pl-2">
                        {items.map((item, index) => (
                            <li key={index} className="flex items-start gap-3 group">
                                <span className="text-xs font-mono text-neutral-300 mt-1">{String(index + 1).padStart(2, '0')}</span>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-sm text-neutral-600 hover:text-primary transition-colors hover:underline decoration-neutral-200 underline-offset-4"
                                >
                                    {item.title}
                                    <ExternalLink size={10} className="inline-block ml-1.5 opacity-50" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
