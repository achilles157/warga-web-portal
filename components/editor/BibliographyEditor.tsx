import { useState } from "react";
import { Plus, X, ExternalLink, Trash2, FileText, Scale, Database, Newspaper, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BibliographyItem } from "@/lib/services/articleService";

interface BibliographyEditorProps {
    value: BibliographyItem[];
    onChange: (items: BibliographyItem[]) => void;
}

const TYPE_OPTIONS = [
    { value: "data", label: "Data & Statistik", icon: Database },
    { value: "legal", label: "Dokumen Hukum", icon: Scale },
    { value: "report", label: "Laporan Riset", icon: FileText },
    { value: "news", label: "Artikel Berita", icon: Newspaper },
    { value: "other", label: "Referensi Lainnya", icon: ExternalLink },
] as const;

export function BibliographyEditor({ value, onChange }: BibliographyEditorProps) {
    const [newItem, setNewItem] = useState<BibliographyItem>({
        title: "",
        url: "",
        source: "",
        type: "other"
    });

    const handleAdd = () => {
        if (!newItem.title.trim() || !newItem.url.trim() || !newItem.source.trim()) return;
        onChange([...value, newItem]);
        setNewItem({ title: "", url: "", source: "", type: "other" });
    };

    const handleRemove = (index: number) => {
        const next = [...value];
        next.splice(index, 1);
        onChange(next);
    };

    const isValid = newItem.title.trim() && newItem.url.trim() && newItem.source.trim();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm flex items-center gap-2 text-ink">
                    <ExternalLink size={16} className="text-primary" />
                    Daftar Pustaka & Referensi
                </h3>
                <span className="text-[10px] font-medium bg-neutral-100 px-2 py-0.5 rounded-full text-neutral-500">
                    {value.length} item
                </span>
            </div>

            {/* List of Items */}
            <div className="space-y-2">
                {value.length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-neutral-100 rounded-xl bg-neutral-50/50">
                        <p className="text-xs text-neutral-400">Belum ada referensi ditambahkan.</p>
                    </div>
                )}
                {value.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-neutral-200 shadow-sm group hover:border-primary/20 transition-colors">
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                            item.type === 'data' ? "bg-blue-50 text-blue-600" :
                                item.type === 'legal' ? "bg-amber-50 text-amber-600" :
                                    item.type === 'report' ? "bg-purple-50 text-purple-600" :
                                        "bg-neutral-100 text-neutral-600"
                        )}>
                            {item.type === 'data' && <Database size={14} />}
                            {item.type === 'legal' && <Scale size={14} />}
                            {item.type === 'report' && <FileText size={14} />}
                            {item.type === 'news' && <Newspaper size={14} />}
                            {item.type === 'other' && <ExternalLink size={14} />}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-ink truncate leading-tight mb-1">{item.title}</p>
                            <div className="flex items-center gap-2 text-xs text-neutral-500">
                                <span className="font-medium bg-neutral-100 px-1.5 rounded">{item.source}</span>
                                <span className="truncate opacity-60">{item.url}</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add New Form - Vertical Stack for Sidebar Safety */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-20" />

                <h4 className="font-bold text-xs uppercase text-neutral-500 mb-4 tracking-wider">Tambah Referensi Baru</h4>

                <div className="space-y-3">
                    {/* Title */}
                    <div>
                        <input
                            type="text"
                            placeholder="Judul Dokumen / Artikel"
                            className="w-full h-9 text-sm px-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-neutral-400"
                            value={newItem.title}
                            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                        />
                    </div>

                    {/* Type & Source Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <select
                                className="w-full h-9 text-sm px-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-primary appearance-none cursor-pointer"
                                value={newItem.type}
                                onChange={e => setNewItem({ ...newItem, type: e.target.value as BibliographyItem["type"] })}
                            >
                                {TYPE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            {/* Custom arrow for select could be added here */}
                        </div>

                        <input
                            type="text"
                            placeholder="Sumber (e.g. BMKG)"
                            className="w-full h-9 text-sm px-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-primary transition-all placeholder:text-neutral-400"
                            value={newItem.source}
                            onChange={e => setNewItem({ ...newItem, source: e.target.value })}
                        />
                    </div>

                    {/* URL */}
                    <div className="relative">
                        <LinkIcon size={14} className="absolute left-3 top-2.5 text-neutral-400" />
                        <input
                            type="url"
                            placeholder="https://tautan-referensi.com"
                            className="w-full h-9 text-sm pl-9 pr-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-primary transition-all placeholder:text-neutral-400"
                            value={newItem.url}
                            onChange={e => setNewItem({ ...newItem, url: e.target.value })}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={!isValid}
                        className={cn(
                            "w-full h-9 flex items-center justify-center gap-2 rounded-lg font-medium text-sm transition-all",
                            isValid
                                ? "bg-ink text-white hover:bg-neutral-800 shadow-md shadow-ink/10 transform hover:scale-[1.02]"
                                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                        )}
                    >
                        <Plus size={16} />
                        Tambahkan ke Daftar
                    </button>
                </div>
            </div>
        </div>
    );
}
