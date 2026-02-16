"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { getArticleById, updateArticle, Article, ArticleStatus, BibliographyItem } from "@/lib/services/articleService";
import { serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { ChevronLeft, Save, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { BibliographyEditor } from "@/components/editor/BibliographyEditor";

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { profile } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [articleId, setArticleId] = useState<string>("");

    const [formData, setFormData] = useState<{
        title: string;
        subtitle: string;
        slug: string;
        cover_image: string;
        body: string;
        is_locked: boolean;
        lock_cta_text: string;
        linked_module_id: string;
        linked_sub_module_id: string;
        category: string;
        status: ArticleStatus;
        bibliography: BibliographyItem[];
    }>({
        title: "",
        subtitle: "",
        slug: "",
        cover_image: "",
        body: "",
        is_locked: false,
        lock_cta_text: "Buka Dokumen Asli di Aplikasi",
        linked_module_id: "ekologi_bencana_sumatera",
        linked_sub_module_id: "",
        category: "Investigasi",
        status: "draft",
        bibliography: []
    });

    // Unwrap params
    const { id } = use(params);

    useEffect(() => {
        async function load() {
            try {
                const data = await getArticleById(id);
                if (data) {
                    setArticleId(data.id!);
                    setFormData({
                        title: data.meta.title,
                        subtitle: data.meta.subtitle,
                        slug: data.meta.slug,
                        cover_image: data.meta.cover_image,
                        body: data.content.body,
                        is_locked: data.content.is_locked,
                        lock_cta_text: data.content.lock_cta_text || "Buka Dokumen Asli di Aplikasi",
                        linked_module_id: data.content.linked_module_id || "",
                        linked_sub_module_id: data.content.linked_sub_module_id || "",
                        category: data.meta.tags?.[0] || "Investigasi",
                        status: data.editorial.status,
                        bibliography: data.bibliography || []
                    });
                }
            } catch (error) {
                console.error("Failed to load article:", error);
                alert("Gagal memuat artikel. Pastikan Anda memiliki izin atau koneksi internet stabil.");
                router.push("/dashboard/articles");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setSaving(true);
        try {
            const updatePayload: Partial<Article> = {
                meta: {
                    title: formData.title,
                    subtitle: formData.subtitle,
                    slug: formData.slug,
                    tags: [formData.category],
                    // We don't overwrite cover_image here unless we had an uploader
                    // But for now, we just pass what we have if we want, 
                    // or we rely on the service to only update what's passed.
                    // The service checks "if (data.meta)", so we should structure it fully if we pass "meta".
                    // However, our service implementation is granular. 
                    // Let's pass the full meta structure we want to update.
                    cover_image: formData.cover_image,
                    read_time_minutes: 0 // preserved/ignored
                },
                content: {
                    body: formData.body,
                    is_locked: formData.is_locked,
                    lock_cta_text: formData.lock_cta_text,
                    linked_module_id: formData.linked_module_id,
                    linked_sub_module_id: formData.linked_sub_module_id
                },
                editorial: {
                    status: formData.status,
                } as any, // Cast to any because Partial<Article> doesn't make nested props partial
                bibliography: formData.bibliography
            };

            if (formData.status === 'published') {
                // We need to explicitly pass this if we want to update it
                // @ts-ignore
                updatePayload.editorial.published_at = serverTimestamp();
            }

            await updateArticle(articleId, updatePayload);
            router.push("/dashboard/articles");
        } catch (err) {
            console.error(err);
            alert("Gagal menyimpan perubahan");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Memuat editor...</div>;

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-neutral-50/95 backdrop-blur-sm z-10 py-4 border-b border-neutral-200/50">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/articles" className="p-2 hover:bg-white rounded-full transition-colors">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="font-display text-xl font-bold">Edit Artikel</h1>
                        <p className="text-xs text-neutral-500">Editing • {articleId}</p>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-ink text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Simpan Perubahan
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-neutral-200">
                        <input
                            type="text"
                            className="w-full text-3xl font-display font-bold placeholder:text-neutral-300 focus:outline-none mb-4"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <textarea
                            className="w-full text-lg text-neutral-600 placeholder:text-neutral-300 focus:outline-none resize-none"
                            rows={2}
                            value={formData.subtitle}
                            onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                        />
                    </div>

                    <div className="bg-white p-0 rounded-xl min-h-[500px]">
                        <RichTextEditor
                            value={formData.body}
                            onChange={val => setFormData({ ...formData, body: val })}
                            placeholder="Tulis artikel dengan gaya..."
                            className="h-full min-h-[500px] border-none rounded-none"
                        />
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    {/* Status Control */}
                    <div className="bg-white p-5 rounded-xl border border-neutral-200">
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Status Publikasi</label>

                        {/* Admin/Staff View: Full Control */}
                        {(profile?.role === "admin" || profile?.role === "staff") ? (
                            <>
                                <select
                                    className={cn(
                                        "w-full p-2 rounded-md border appearance-none font-medium mb-2",
                                        formData.status === 'published'
                                            ? "bg-green-50 border-green-200 text-green-700"
                                            : "bg-neutral-50 border-neutral-200 text-neutral-600"
                                    )}
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as ArticleStatus })}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="pending_review">Pending Review</option>
                                    <option value="published">Published (Live)</option>
                                    <option value="rejected">Rejected (Revisi)</option>
                                </select>
                                <p className="text-xs text-neutral-400">
                                    {formData.status === 'published'
                                        ? "Artikel ini tayang untuk publik."
                                        : "Status artikel saat ini."}
                                </p>
                            </>
                        ) : (
                            /* Contributor View: Submit Workflow */
                            <div className="space-y-3">
                                <div className={cn(
                                    "p-3 rounded-lg text-sm font-medium border",
                                    formData.status === 'published' && "bg-green-50 border-green-200 text-green-700",
                                    formData.status === 'draft' && "bg-neutral-50 border-neutral-200 text-neutral-600",
                                    formData.status === 'pending_review' && "bg-orange-50 border-orange-200 text-orange-700",
                                    formData.status === 'rejected' && "bg-red-50 border-red-200 text-red-700",
                                )}>
                                    {formData.status === 'draft' && "Draft (Belum Diajukan)"}
                                    {formData.status === 'pending_review' && "Sedang Ditinjau Admin"}
                                    {formData.status === 'published' && "Sudah Terbit (Published)"}
                                    {formData.status === 'rejected' && "Perlu Revisi (Ditolak)"}
                                </div>

                                {formData.status === 'draft' && (
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status: 'pending_review' })}
                                        className="w-full py-2 px-4 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-bold transition-colors"
                                    >
                                        Ajukan Review
                                    </button>
                                )}

                                {formData.status === 'rejected' && (
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status: 'pending_review' })}
                                        className="w-full py-2 px-4 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg text-sm font-bold transition-colors"
                                    >
                                        Ajukan Ulang
                                    </button>
                                )}

                                <p className="text-xs text-neutral-400">
                                    {formData.status === 'draft'
                                        ? "Klik tombol di atas untuk mengirim artikel ke meja redaksi."
                                        : "Hubungi admin jika butuh perubahan mendesak."}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Meta */}
                    <div className="bg-white p-5 rounded-xl border border-neutral-200">
                        <h3 className="font-bold text-sm mb-4">Metadata</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-500 mb-1.5">URL Slug</label>
                                <input
                                    type="text"
                                    className="w-full text-xs p-2 bg-neutral-50 border border-neutral-200 rounded-md text-neutral-600"
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Kategori</label>
                                <select
                                    className="w-full text-sm p-2 bg-neutral-50 border border-neutral-200 rounded-md text-neutral-600 focus:outline-none focus:border-primary"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="Investigasi">Investigasi</option>
                                    <option value="Opini">Opini</option>
                                    <option value="Sejarah">Sejarah</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Locked Content Config */}
                    <div className="bg-white p-5 rounded-xl border border-neutral-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <Lock size={14} className="text-primary" />
                                App Integration
                            </h3>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={formData.is_locked}
                                    onChange={e => setFormData({ ...formData, is_locked: e.target.checked })}
                                />
                                <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        {formData.is_locked && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1.5">Linked Module ID</label>
                                    <input
                                        type="text"
                                        className="w-full text-sm p-2 border border-neutral-200 rounded-md focus:border-primary focus:outline-none"
                                        value={formData.linked_module_id}
                                        onChange={e => setFormData({ ...formData, linked_module_id: e.target.value })}
                                        placeholder="e.g. ekologi_bencana_sumatera"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1.5">Linked Sub-Module ID (Chapter)</label>
                                    <input
                                        type="text"
                                        className="w-full text-sm p-2 border border-neutral-200 rounded-md focus:border-primary focus:outline-none"
                                        value={formData.linked_sub_module_id}
                                        onChange={e => setFormData({ ...formData, linked_sub_module_id: e.target.value })}
                                        placeholder="e.g. sub_03_dokumen_tata_kelola"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1.5">Call to Action Text</label>
                                    <input
                                        type="text"
                                        className="w-full text-sm p-2 border border-neutral-200 rounded-md focus:border-primary focus:outline-none"
                                        value={formData.lock_cta_text}
                                        onChange={e => setFormData({ ...formData, lock_cta_text: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bibliography Editor */}
                    <div className="bg-white p-5 rounded-xl border border-neutral-200">
                        <BibliographyEditor
                            value={formData.bibliography}
                            onChange={items => setFormData({ ...formData, bibliography: items })}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
