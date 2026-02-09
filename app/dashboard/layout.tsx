"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/auth/AuthContext";
import { LayoutDashboard, FileText, Settings, LogOut, PlusCircle, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, profile, loading, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    if (loading || !profile) {
        return <div className="min-h-screen flex items-center justify-center text-neutral-400">Loading Dashboard...</div>;
    }

    return (
        <div className="flex min-h-screen bg-neutral-50 relative">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 z-20 flex items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative w-8 h-8">
                        <Image
                            src="/images/new_logo.png"
                            alt="Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="font-display font-bold text-lg tracking-tight">Warga<span className="text-primary">.</span></span>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-md"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-neutral-200 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-neutral-100 hidden md:block">
                    <Link href="/" className="flex items-center gap-3 mb-1 group">
                        <div className="relative w-8 h-8">
                            <Image
                                src="/images/new_logo.png"
                                alt="Logo"
                                fill
                                className="object-contain group-hover:scale-105 transition-transform"
                            />
                        </div>
                        <span className="font-display font-bold text-xl tracking-tight">Warga Daily<span className="text-primary">.</span></span>
                    </Link>
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                        Editorial
                    </span>
                </div>

                <div className="p-6 border-b border-neutral-100 md:hidden flex items-center justify-between">
                    <span className="font-display font-bold text-xl">Menu</span>
                    <button onClick={() => setIsMobileMenuOpen(false)}>
                        <X size={24} className="text-neutral-400" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <SidebarItem href="/dashboard" icon={LayoutDashboard} label="Overview" active={pathname === "/dashboard"} />
                    <SidebarItem href="/dashboard/articles" icon={FileText} label="Articles" active={pathname.startsWith("/dashboard/articles")} />
                    <SidebarItem href="/dashboard/settings" icon={Settings} label="Settings" active={pathname === "/dashboard/settings"} />
                </nav>

                <div className="p-4 border-t border-neutral-100">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-200 overflow-hidden relative flex-shrink-0">
                            {profile.photo_url ? (
                                <Image
                                    src={profile.photo_url}
                                    alt={profile.display_name}
                                    fill
                                    className="object-cover"
                                    sizes="32px"
                                />
                            ) : (
                                <div className="w-full h-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                                    {profile.display_name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{profile.display_name}</p>
                            <p className="text-xs text-neutral-500 truncate capitalize">{profile.role}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300">
                {children}
            </main>
        </div>
    );
}

function SidebarItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                active
                    ? "bg-neutral-100 text-ink"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-ink"
            )}
        >
            <Icon size={18} className={cn(active ? "text-primary" : "text-neutral-400")} />
            {label}
        </Link>
    );
}
