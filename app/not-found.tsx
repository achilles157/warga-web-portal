import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-4 text-center">
            <div className="relative w-64 h-64 mb-8">
                <Image
                    src="/images/mascot/bung_warga_neutral.png"
                    alt="Bung Warga Bingung"
                    fill
                    className="object-contain"
                />
            </div>
            <h2 className="font-display font-bold text-4xl mb-4">Waduh, Nyasar?</h2>
            <p className="text-neutral-600 max-w-md mb-8">
                Halaman yang kamu cari sepertinya sudah dipindahkan atau tidak pernah ada. Bung Warga juga bingung nih.
            </p>
            <Link
                href="/"
                className="bg-ink text-paper px-8 py-3 rounded-full font-bold hover:bg-neutral-800 transition-colors"
            >
                Kembali ke Beranda
            </Link>
        </div>
    );
}
