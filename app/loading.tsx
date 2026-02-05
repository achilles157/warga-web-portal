import Image from "next/image";

export default function Loading() {
    return (
        <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-4">
            <div className="relative w-32 h-32 mb-4 animate-pulse">
                <Image
                    src="/images/mascot/bung_warga_thinking.png"
                    alt="Loading..."
                    fill
                    className="object-contain"
                />
            </div>
            <p className="font-display font-medium text-neutral-400">Memuat Data...</p>
        </div>
    );
}
