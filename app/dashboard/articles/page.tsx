"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";
import { getArticles, Article, deleteArticle } from "@/lib/services/articleService";
import { cn } from "@/lib/utils";

import { useAuth } from "@/components/auth/AuthContext";

import { setWeeklyPicks } from "@/lib/services/articleService";
import { Star } from "lucide-react";

export default function ArticlesPage() {
    const { user, profile } = useAuth();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    // Weekly Picks Logic
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSettingPicks, setIsSettingPicks] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");

    useEffect(() => {
        async function fetch() {
            if (!user) return;
            // Use profile for role check
            const isStaffOrAdmin = profile?.role === 'admin' || profile?.role === 'staff';
            // @ts-ignore
            const data = await getArticles(isStaffOrAdmin ? undefined : user.uid);
            setArticles(data);
            setLoading(false);
        }
        fetch();
    }, [user, profile]);

    const handleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            if (selectedIds.length >= 3) {
                alert("Maksimal 3 artikel untuk Weekly Picks.");
                return;
            }
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSetWeeklyPicks = async () => {
        if (selectedIds.length === 0) return;

        const note = prompt("Masukkan Catatan Editor (Opsional):", "Pilihan Redaksi Minggu Ini");
        if (note === null) return; // Cancelled

        setIsSettingPicks(true);
        try {
            await setWeeklyPicks(selectedIds, note);
            alert("Berhasil update Weekly Picks!");
            setSelectedIds([]);
        } catch (error) {
            console.error(error);
            alert("Gagal update Weekly Picks.");
        } finally {
            setIsSettingPicks(false);
        }
    };

    // Filter Logic
    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.meta.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || article.editorial.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || (article.meta.tags && article.meta.tags.includes(categoryFilter));
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const isEditor = profile?.role === 'admin' || profile?.role === 'staff';

    return (
        <div>
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-2xl font-bold mb-1">Manajemen Artikel</h1>
                    <p className="text-neutral-500 text-sm">Kelola semua konten yang akan terbit di Warga Daily.</p>
                </div>
                <div className="flex gap-3">
                    {isEditor && selectedIds.length > 0 && (
                        <button
                            onClick={handleSetWeeklyPicks}
                            disabled={isSettingPicks}
                            className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors shadow-sm animate-in fade-in zoom-in duration-200"
                        >
                            <Star size={18} fill="currentColor" />
                            {isSettingPicks ? "Menyimpan..." : `Set Weekly Picks (${selectedIds.length})`}
                        </button>
                    )}
                    <Link
                        href="/dashboard/articles/new"
                        className="flex items-center gap-2 bg-ink text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
                    >
                        <Plus size={18} />
                        Buat Artikel
                    </Link>
                </div>
            </header>

            {/* Filters */}
            <div className="bg-white border border-neutral-200 p-4 rounded-xl flex flex-wrap items-center gap-4 mb-6">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari judul artikel..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <select
                        className="px-3 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 rounded-lg focus:outline-none hover:bg-neutral-50"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Semua Status</option>
                        <option value="draft">Draft</option>
                        <option value="pending_review">Pending Review</option>
                        <option value="published">Published</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <select
                        className="px-3 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 rounded-lg focus:outline-none hover:bg-neutral-50"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">Semua Kategori</option>
                        <option value="Investigasi">Investigasi</option>
                        <option value="Opini">Opini</option>
                        <option value="Sejarah">Sejarah</option>
                    </select>
                </div>
            </div>

            {/* List */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="p-8 text-center text-neutral-400 text-sm">Memuat artikel...</div>
                ) : filteredArticles.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-neutral-900 font-medium mb-2">Tidak ditemukan artikel</p>
                        <p className="text-neutral-500 text-sm mb-4">Coba ubah filter pencarian Anda.</p>
                        {articles.length === 0 && (
                            <Link href="/dashboard/articles/new" className="text-primary text-sm font-bold hover:underline">
                                + Buat Artikel Pertama
                            </Link>
                        )}
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50/50 border-b border-neutral-100 text-neutral-500 text-xs uppercase tracking-wider">
                                {isEditor && <th className="px-6 py-4 w-10">Select</th>}
                                <th className="px-6 py-4 font-medium">Judul</th>
                                <th className="px-6 py-4 font-medium">Penulis</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Tanggal</th>
                                <th className="px-6 py-4 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-neutral-100">
                            {filteredArticles.map((article) => (
                                <tr key={article.id} className={cn("hover:bg-neutral-50/50 transition-colors", selectedIds.includes(article.id!) && "bg-blue-50/50")}>
                                    {isEditor && (
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                                checked={selectedIds.includes(article.id!)}
                                                onChange={() => handleSelect(article.id!)}
                                            />
                                        </td>
                                    )}
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-ink mb-0.5 line-clamp-1">{article.meta.title}</p>
                                        <p className="text-neutral-400 text-xs">{article.meta.slug}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-neutral-500">
                                                {article.editorial.author_name.charAt(0)}
                                            </div>
                                            <span className="text-neutral-600">{article.editorial.author_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={article.editorial.status} />
                                    </td>
                                    <td className="px-6 py-4 text-neutral-500">
                                        {/* Placeholder Date Logic */}
                                        {new Date().toLocaleDateString("id-ID")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Link href={`/dashboard/articles/${article.id}`} className="text-neutral-600 hover:text-primary font-medium text-xs">
                                                Edit
                                            </Link>
                                            <button
                                                onClick={async () => {
                                                    if (confirm("Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.")) {
                                                        try {
                                                            await deleteArticle(article.id!);
                                                            setArticles(articles.filter(a => a.id !== article.id));
                                                        } catch (error) {
                                                            console.error("Failed to delete", error);
                                                            alert("Gagal menghapus artikel.");
                                                        }
                                                    }
                                                }}
                                                className="text-red-400 hover:text-red-600 font-medium text-xs"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        published: "bg-green-100 text-green-700 border-green-200",
        draft: "bg-neutral-100 text-neutral-700 border-neutral-200",
        pending_review: "bg-orange-100 text-orange-700 border-orange-200",
        rejected: "bg-red-100 text-red-700 border-red-200",
    };

    // @ts-ignore
    const style = styles[status] || styles.draft;

    return (
        <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border", style)}>
            {status.replace("_", " ")}
        </span>
    );
}
