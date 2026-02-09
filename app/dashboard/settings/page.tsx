import { Construction } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <div className="bg-neutral-100 p-4 rounded-full mb-4">
                <Construction className="w-8 h-8 text-neutral-400" />
            </div>
            <h1 className="text-xl font-bold font-display mb-2">Pengaturan Akun</h1>
            <p className="text-neutral-500 max-w-md">
                Fitur pengaturan profil dan akun sedang dalam pengembangan. Segera hadir!
            </p>
        </div>
    );
}
