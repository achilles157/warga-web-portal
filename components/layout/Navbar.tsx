"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthContext";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { user, loading } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
                isScrolled
                    ? "bg-paper/80 backdrop-blur-md border-neutral-200 py-3"
                    : "bg-paper border-transparent py-5"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10">
                        <Image
                            src="/images/new_logo.png"
                            alt="WargaDaily Logo"
                            fill
                            className="object-contain group-hover:rotate-6 transition-transform"
                        />
                    </div>
                    <span className="font-display font-bold text-2xl tracking-tight">
                        WargaDaily<span className="text-accent">.</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <NavLink href="/investigasi">Investigasi</NavLink>
                    <NavLink href="/opini">Opini</NavLink>
                    <NavLink href="/sejarah">Sejarah</NavLink>
                </div>

                {/* CTA */}
                <div className="hidden md:block">
                    {!loading && (
                        user ? (
                            <Link
                                href="/dashboard"
                                className="bg-primary text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-ink text-paper px-6 py-2.5 rounded-full font-medium text-sm hover:bg-neutral-800 transition-colors"
                            >
                                Kirim Tulisan
                            </Link>
                        )
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-ink"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-paper border-b border-neutral-200 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 space-y-4">
                            <MobileNavLink href="/investigasi">Investigasi</MobileNavLink>
                            <MobileNavLink href="/opini">Opini</MobileNavLink>
                            <MobileNavLink href="/sejarah">Sejarah</MobileNavLink>

                            {!loading && (
                                user ? (
                                    <Link
                                        href="/dashboard"
                                        className="bg-primary text-white text-center py-3 rounded-full font-medium mt-4 block"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="bg-ink text-paper text-center py-3 rounded-full font-medium mt-4 block"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Kirim Tulisan
                                    </Link>
                                )
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-neutral-600 hover:text-ink font-medium text-sm transition-colors"
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-lg font-display text-ink block py-2"
        >
            {children}
        </Link>
    );
}
