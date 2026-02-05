"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
    const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, loading } = useAuth();
    const router = useRouter();

    // State
    const [mode, setMode] = useState<"login" | "register">("login");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Form Data
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (!loading && user) {
            router.push("/dashboard");
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            if (mode === "login") {
                await signInWithEmail(email, password);
            } else {
                await signUpWithEmail(name, email, password);
            }
        } catch (err: any) {
            // Simple error handling
            if (err.code === 'auth/invalid-credential') {
                setError("Email atau password salah.");
            } else if (err.code === 'auth/email-already-in-use') {
                setError("Email sudah terdaftar.");
            } else if (err.code === 'auth/weak-password') {
                setError("Password terlalu lemah (min. 6 karakter).");
            } else {
                setError("Terjadi kesalahan. Coba lagi.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-paper p-6">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-neutral-200 p-8 rounded-xl shadow-sm"
                >
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <Image
                                src="/images/new_logo.png"
                                alt="Warga Daily Logo"
                                width={64}
                                height={64}
                                className="object-contain" // Simplified since it's a small logo
                            />
                        </div>
                        <h1 className="font-display font-bold text-3xl mb-2">Warga Daily.</h1>
                        <p className="text-neutral-500 text-sm">
                            {mode === "login" ? "Masuk kembali untuk melanjutkan." : "Bergabung dan mulai menulis."}
                        </p>
                    </div>

                    {/* Google Button */}
                    <button
                        onClick={signInWithGoogle}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-neutral-300 hover:bg-neutral-50 text-ink font-medium py-2.5 px-4 rounded-lg transition-colors group mb-6"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span>Google {mode === "login" ? "Sign In" : "Sign Up"}</span>
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-neutral-400">Atau manual</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {mode === "register" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <label className="block text-xs font-medium text-neutral-700 mb-1">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-ink text-sm"
                                        placeholder="Jurnalis Warga"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-ink text-sm"
                                placeholder="nama@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-ink text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-xs text-center">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-ink text-white font-medium py-2.5 rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {submitting && <Loader2 size={16} className="animate-spin" />}
                            {mode === "login" ? "Masuk" : "Daftar"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-neutral-500">
                        {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
                        <button
                            className="text-primary font-bold hover:underline"
                            onClick={() => {
                                setMode(mode === "login" ? "register" : "login");
                                setError("");
                            }}
                        >
                            {mode === "login" ? "Daftar Sekarang" : "Masuk"}
                        </button>
                    </p>

                </motion.div>
            </div>
        </div>
    );
}
