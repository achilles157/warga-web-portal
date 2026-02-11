"use client";

import { useState } from "react";
import { Plus, X, ExternalLink, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BibliographyItem {
    title: string;
    url: string;
}

interface BibliographyEditorProps {
    value: BibliographyItem[];
    onChange: (items: BibliographyItem[]) => void;
}

export function BibliographyEditor({ value, onChange }: BibliographyEditorProps) {
    const [newItem, setNewItem] = useState<BibliographyItem>({ title: "", url: "" });

    const handleAdd = () => {
        if (!newItem.title.trim() || !newItem.url.trim()) return;
        onChange([...value, newItem]);
        setNewItem({ title: "", url: "" });
    };

    const handleRemove = (index: number) => {
        const next = [...value];
        next.splice(index, 1);
        onChange(next);
    };

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
                <ExternalLink size={14} className="text-primary" />
                Daftar Pustaka & Referensi
            </h3>

            <div className="space-y-3">
                {value.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-100 group">
                        <div className="overflow-hidden">
                            <p className="font-medium text-sm text-ink truncate">{item.title}</p>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-400 hover:text-primary truncate block">
                                {item.url}
                            </a>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Judul Referensi"
                    className="flex-1 text-sm p-2 bg-white border border-neutral-200 rounded-md focus:outline-none focus:border-primary"
                    value={newItem.title}
                    onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                />
                <input
                    type="url"
                    placeholder="URL (https://...)"
                    className="flex-1 text-sm p-2 bg-white border border-neutral-200 rounded-md focus:outline-none focus:border-primary"
                    value={newItem.url}
                    onChange={e => setNewItem({ ...newItem, url: e.target.value })}
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    disabled={!newItem.title || !newItem.url}
                    className="bg-neutral-900 text-white p-2 rounded-md hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Plus size={18} />
                </button>
            </div>

            <p className="text-xs text-neutral-400">
                Tambahkan link ke jurnal, berita, atau dokumen resmi untuk memperkuat kredibilitas artikel.
            </p>
        </div>
    );
}
