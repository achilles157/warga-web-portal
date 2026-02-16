"use client";

import { useAuth } from "@/components/auth/AuthContext";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getArticles, Article } from "@/lib/services/articleService";

export default function DashboardOverview() {
    const { profile } = useAuth();
    const [stats, setStats] = useState({
        totalViews: 0,
        pendingCount: 0,
        contributionCount: 0
    });
    const [recentArticles, setRecentArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            if (!profile?.uid) return;

            try {
                // Fetch all articles by this author to calculate stats
                // If user is admin, maybe they want to see ALL stats? 
                // For now, let's stick to "My Stats" or "Team Stats" based on role?
                // The request implies "My Dashboard", so we fetch by authorId.
                // However, for "Artikel Pending", an Editor might want to see ALL pending articles.
                // Let's assume this is a personal dashboard for now.

                let articles: Article[] = [];

                if (profile.role === 'admin' || profile.role === 'staff') {
                    // Admin/Staff sees all articles to monitor system health
                    // or maybe just their own? The prompt says "Selamat Datang, [Name]", implying personal.
                    // But "Artikel Pending" for an admin usually means "Todo list".
                    // Let's fetch ALL articles for Admin/Staff to provide a high-level overview.
                    articles = await getArticles();
                } else {
                    // Contributors only see their own
                    articles = await getArticles(profile.uid);
                }

                const totalViews = articles.reduce((acc, curr) => acc + (curr.metrics?.views || 0), 0);
                const pendingCount = articles.filter(a => a.editorial.status === 'pending_review').length;
                const contributionCount = articles.filter(a => a.editorial.author_id === profile.uid).length;

                setStats({
                    totalViews,
                    pendingCount,
                    contributionCount
                });

                // Get top 5 recent articles for activity stream
                setRecentArticles(articles.slice(0, 5));
            } catch (error) {
                console.error("Failed to load dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        }

        loadStats();
    }, [profile]);

    return (
        <div>
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-2xl font-bold mb-1">Selamat Datang, {profile?.display_name.split(" ")[0]}</h1>
                    <p className="text-neutral-500 text-sm">Berikut adalah ringkasan aktivitas redaksi hari ini.</p>
                </div>
                <Link
                    href="/dashboard/articles/new"
                    className="flex items-center gap-2 bg-ink text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    Tulis Artikel Baru
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    label="Total Views"
                    value={loading ? "..." : stats.totalViews.toLocaleString()}
                    trend="All Time"
                />
                <StatCard
                    label="Artikel Pending"
                    value={loading ? "..." : stats.pendingCount.toString()}
                    trend={stats.pendingCount > 0 ? "Perlu Review" : "Aman"}
                    alert={stats.pendingCount > 0}
                />
                <StatCard
                    label="Total Kontribusi"
                    value={loading ? "..." : stats.contributionCount.toString()}
                />
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-6">
                <h2 className="font-bold text-lg mb-4">Aktivitas Terkini</h2>
                {loading ? (
                    <div className="text-center py-12 text-neutral-400 text-sm">Memuat data...</div>
                ) : recentArticles.length > 0 ? (
                    <div className="space-y-4">
                        {recentArticles.map(article => (
                            <div key={article.id} className="flex items-center justify-between border-b border-neutral-100 last:border-0 pb-4 last:pb-0">
                                <div>
                                    <h4 className="font-medium text-ink text-sm truncate max-w-md">{article.meta.title}</h4>
                                    <p className="text-xs text-neutral-400">
                                        {new Date(article.editorial.updated_at?.seconds * 1000).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                        <span className="mx-1">•</span>
                                        <span className={cn(
                                            "capitalize",
                                            article.editorial.status === 'published' ? "text-green-600" :
                                                article.editorial.status === 'rejected' ? "text-red-600" : "text-orange-600"
                                        )}>{article.editorial.status.replace('_', ' ')}</span>
                                    </p>
                                </div>
                                <Link
                                    href={`/dashboard/articles/${article.id}`}
                                    className="text-xs font-medium text-primary hover:underline"
                                >
                                    Lihat
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-neutral-400 text-sm">
                        Belum ada aktivitas baru.
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ label, value, trend, alert }: { label: string; value: string; trend?: string; alert?: boolean }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <h3 className="text-neutral-500 text-xs font-medium uppercase tracking-wider mb-2">{label}</h3>
            <div className="flex items-end justify-between">
                <span className="text-3xl font-display font-bold text-ink">{value}</span>
                {trend && (
                    <span className={cn("text-xs font-medium px-2 py-1 rounded-full", alert ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700")}>
                        {trend}
                    </span>
                )}
            </div>
        </div>
    );
}

import { cn } from "@/lib/utils";
