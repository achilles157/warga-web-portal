"use client";

import { useAuth } from "@/components/auth/AuthContext";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
    const { profile } = useAuth();

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
                <StatCard label="Total Views (Mingguan)" value="24.5k" trend="+12%" />
                <StatCard label="Artikel Pending" value="3" trend="Perlu Review" alert />
                <StatCard label="Total Kontribusi" value="12" />
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-6">
                <h2 className="font-bold text-lg mb-4">Aktivitas Terkini</h2>
                <div className="text-center py-12 text-neutral-400 text-sm">
                    Belum ada aktivitas baru.
                </div>
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
