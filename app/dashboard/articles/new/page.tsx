"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { createArticle } from "@/lib/services/articleService";
import { cn } from "@/lib/utils";
import { ChevronLeft, Save, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

export default function NewArticlePage() {
    const { profile } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        slug: "",
        cover_image: "",
        body: "",
        is_locked: false,
        lock_cta_text: "Buka Dokumen Asli di Aplikasi",
        linked_module_id: "bencanasumatra",
        category: "Investigasi",
        status: "draft"
    });

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData(prev => ({ ...prev, title, slug: generateSlug(title) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setLoading(true);
        try {
            await createArticle(profile.uid, profile.display_name, {
                meta: {
                    title: formData.title,
                    subtitle: formData.subtitle,
                    slug: formData.slug,
                    cover_image: formData.cover_image,
                    tags: [formData.category],
                    read_time_minutes: 5 // calc later
                },
                content: {
                    body: formData.body,
                    is_locked: formData.is_locked,
                    lock_cta_text: formData.lock_cta_text,
                    linked_module_id: formData.linked_module_id
                },
                editorial: {
                    author_id: profile.uid,
                    author_name: profile.display_name,
                    status: formData.status as any,
                    published_at: formData.status === 'published' ? new Date() : null
                }
            });
            router.push("/dashboard/articles");
        } catch (err) {
            console.error(err);
            alert("Gagal membuat artikel");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-neutral-50/95 backdrop-blur-sm z-10 py-4 border-b border-neutral-200/50">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/articles" className="p-2 hover:bg-white rounded-full transition-colors">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="font-display text-xl font-bold">Artikel Baru</h1>
                        <p className="text-xs text-neutral-500">Draft • {profile?.display_name}</p>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-ink text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {formData.status === 'published' ? 'Terbitkan Sekarang' : 'Simpan Draft'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-neutral-200">
                        <input
                            type="text"
                            placeholder="Judul Artikel..."
                            className="w-full text-3xl font-display font-bold placeholder:text-neutral-300 focus:outline-none mb-4"
                            value={formData.title}
                            onChange={handleTitleChange}
                            required
                        />
                        <textarea
                            placeholder="Tulis ringkasan singkat (lead paragraph)..."
                            className="w-full text-lg text-neutral-600 placeholder:text-neutral-300 focus:outline-none resize-none"
                            rows={2}
                            value={formData.subtitle}
                            onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                        />
                    </div>

                    <div className="bg-white p-0 rounded-xl overflow-hidden min-h-[500px]">
                        <RichTextEditor
                            value={formData.body}
                            onChange={val => setFormData({ ...formData, body: val })}
                            placeholder="Mulai menulis cerita Anda di sini (Markdown Supported)..."
                            className="h-full min-h-[500px] border-none rounded-none"
                        />
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    {/* Status Control */}
                    <div className="bg-white p-5 rounded-xl border border-neutral-200">
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Status Publikasi</label>
                        <select
                            className={cn(
                                "w-full p-2 rounded-md border appearance-none font-medium mb-2",
                                formData.status === 'published'
                                    ? "bg-green-50 border-green-200 text-green-700"
                                    : "bg-neutral-50 border-neutral-200 text-neutral-600"
                            )}
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="draft">Draft</option>
                            <option value="pending_review">Pending Review</option>
                            {(profile?.role === "admin" || profile?.role === "staff") && (
                                <option value="published">Published (Live)</option>
                            )}
                        </select>
                        <p className="text-xs text-neutral-400">
                            {formData.status === 'published'
                                ? "Artikel ini dapat dibaca oleh publik."
                                : "Hanya terlihat di dashboard."}
                        </p>
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
                                    readOnly
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
                </div>
            </div>
        </form>
    );
}
