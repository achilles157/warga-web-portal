export function Footer() {
    return (
        <footer className="bg-neutral-50 border-t border-neutral-200 py-12">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="font-display font-bold text-xl mb-4">Warga Daily.</h3>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            Platform jurnalisme warga yang independen dan terpercaya.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-neutral-400">Rubrik</h4>
                        <ul className="space-y-2 text-sm text-neutral-600">
                            <li><a href="#" className="hover:text-ink">Investigasi</a></li>
                            <li><a href="#" className="hover:text-ink">Opini</a></li>
                            <li><a href="#" className="hover:text-ink">Sejarah</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-neutral-400">Tentang</h4>
                        <ul className="space-y-2 text-sm text-neutral-600">
                            <li><a href="#" className="hover:text-ink">Redaksi</a></li>
                            <li><a href="#" className="hover:text-ink">Pedoman Media Siber</a></li>
                            <li><a href="#" className="hover:text-ink">Kontak</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-neutral-400">Legal</h4>
                        <ul className="space-y-2 text-sm text-neutral-600">
                            <li><a href="#" className="hover:text-ink">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-ink">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-neutral-200 text-center text-neutral-400 text-xs">
                    &copy; {new Date().getFullYear()} Warga Daily. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
