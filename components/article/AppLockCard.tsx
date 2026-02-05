"use client";

import { Lock, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

interface AppLockCardProps {
    moduleId: string;
    subModuleId?: string;
    ctaText?: string;
}

export function AppLockCard({ moduleId, subModuleId, ctaText = "Buka di Aplikasi" }: AppLockCardProps) {
    const handleOpenApp = () => {
        // Deep link logic
        // Standard scheme: wargaplus://open/module/{release_id}/{sub_module_id}
        const url = subModuleId
            ? `wargaplus://open/module/${moduleId}/${subModuleId}`
            : `wargaplus://open/module/${moduleId}`;

        window.location.href = url;
    };

    return (
        <div className="relative z-10 mx-auto max-w-lg -mt-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl border border-white/50 shadow-2xl text-center"
            >
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock size={32} />
                </div>

                <h3 className="font-display font-bold text-2xl text-ink mb-3">
                    Konten Eksklusif
                </h3>

                <p className="text-neutral-600 mb-8 leading-relaxed">
                    Artikel ini merupakan bagian dari investigasi mendalam yang hanya tersedia penuh di aplikasi WargaPlus.
                </p>

                <button
                    onClick={handleOpenApp}
                    className="group bg-primary text-white w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                    <Smartphone size={20} />
                    {ctaText}
                </button>

                <p className="mt-4 text-xs text-neutral-400 font-mono">
                    Module ID: {moduleId}
                </p>
            </motion.div>
        </div>
    );
}
