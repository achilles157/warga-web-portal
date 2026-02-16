import { useState } from "react";
import { Plus, X, ExternalLink, Trash2, FileText, Scale, Database, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { BibliographyItem } from "@/lib/services/articleService";

interface BibliographyEditorProps {
    value: BibliographyItem[];
    onChange: (items: BibliographyItem[]) => void;
}

const TYPE_OPTIONS = [
    { value: "data", label: "Data", icon: Database },
    { value: "legal", label: "Hukum", icon: Scale },
    { value: "report", label: "Laporan", icon: FileText },
    { value: "news", label: "Berita", icon: Newspaper },
    { value: "other", label: "Lainnya", icon: ExternalLink },
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

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
                <ExternalLink size={14} className="text-primary" />
                Daftar Pustaka & Referensi
            </h3>

            <div className="space-y-3">
                {value.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-100 group">
                        <div className="overflow-hidden flex-1 grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-1">
                                <span className={cn(
                                    "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border",
                                    item.type === 'data' ? "bg-blue-50 text-blue-600 border-blue-200" :
                                        item.type === 'legal' ? "bg-amber-50 text-amber-600 border-amber-200" :
                                            item.type === 'report' ? "bg-purple-50 text-purple-600 border-purple-200" :
                                                "bg-neutral-100 text-neutral-600 border-neutral-200"
                                )}>
                                    {item.type}
                                </span>
                            </div>
                            <div className="col-span-11 pl-2">
                                <p className="font-medium text-sm text-ink truncate">
                                    {item.title} <span className="text-neutral-400 font-normal">• {item.source}</span>
                                </p>
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-400 hover:text-primary truncate block">
                                    {item.url}
                                </a>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100 ml-2"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <div className="grid grid-cols-12 gap-4 mb-4">
                    {/* Type Select */}
                    <div className="col-span-12 md:col-span-3">
                        <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase">Tipe Data</label>
                        <select
                            className="w-full h-10 text-sm px-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-primary"
                            value={newItem.type}
                            onChange={e => setNewItem({ ...newItem, type: e.target.value as BibliographyItem["type"] })}
                        >
                            {TYPE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Source Input */}
                    <div className="col-span-12 md:col-span-4">
                        <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase">Sumber / Institusi</label>
                        <input
                            type="text"
                            placeholder="Contoh: LAPAN, BMKG, UU Ciptaker"
                            className="w-full h-10 text-sm px-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                            value={newItem.source}
                            onChange={e => setNewItem({ ...newItem, source: e.target.value })}
                        />
                    </div>

                    {/* URL Input */}
                    <div className="col-span-12 md:col-span-5">
                        <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase">Link Tautan</label>
                        <input
                            type="url"
                            placeholder="https://"
                            className="w-full h-10 text-sm px-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                            value={newItem.url}
                            onChange={e => setNewItem({ ...newItem, url: e.target.value })}
                        />
                    </div>

                    {/* Title Input */}
                    <div className="col-span-12">
                        <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase">Judul Dokumen / Artikel</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Judul lengkap referensi"
                                className="w-full h-10 text-sm px-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                                value={newItem.title}
                                onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={handleAdd}
                                disabled={!newItem.title || !newItem.url || !newItem.source}
                                className="h-10 w-auto px-6 flex items-center justify-center bg-ink text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 font-medium text-sm"
                            >
                                <Plus size={16} className="mr-2" />
                                Tambah
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-neutral-400">
                    *Pastikan semua field terisi untuk menambahkan referensi verifikasi.
                </p>
            </div>
        </div>
    );
}
