import { getUserById } from "@/lib/services/userService";
import { getArticlesByAuthor } from "@/lib/services/articleService";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Calendar, Globe } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cn } from "@/lib/utils";

export const revalidate = 300; // ISR every 5 minutes

export default async function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const author = await getUserById(id);
    const articles = await getArticlesByAuthor(id);

    if (!author) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-neutral-50 pb-20">
            {/* Navigation */}
            <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-200 py-4 mb-8">
                <div className="container mx-auto px-6 grid grid-cols-3 items-center">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-full transition-colors text-ink">
                            <ArrowLeft size={20} />
                            <span className="text-sm font-medium hidden md:inline">Kembali</span>
                        </Link>
                    </div>
                    <div className="text-center flex items-center justify-center gap-2">
                        <div className="relative w-8 h-8">
                            <Image
                                src="/images/new_logo.png"
                                alt="Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-display font-bold text-lg tracking-tight">Warga Daily.</span>
                    </div>
                    <div />
                </div>
            </nav>

            {/* Profile Header */}
            <div className="container mx-auto px-6 max-w-4xl mb-12">
                <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-neutral-100 border-4 border-white shadow-md flex-shrink-0 relative">
                        {author.photo_url ? (
                            <Image
                                src={author.photo_url}
                                alt={author.display_name}
                                fill
                                className="object-cover"
                                sizes="128px"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary text-white text-4xl font-bold font-display">
                                {author.display_name.charAt(0)}
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2 mb-2">
                            <h1 className="font-display font-bold text-3xl text-ink">{author.display_name}</h1>
                            <span className="bg-neutral-100 text-neutral-600 px-3 py-0.5 rounded-full text-xs uppercase font-bold tracking-wider">
                                {author.role}
                            </span>
                        </div>

                        <p className="text-neutral-600 text-lg leading-relaxed mb-6 max-w-2xl">
                            {author.bio || "Belum ada bio."}
                        </p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-neutral-500">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>Bergabung {author.created_at ? format(author.created_at.toDate(), "MMMM yyyy", { locale: idLocale }) : "-"}</span>
                            </div>
                            {/* Placeholder for future location/website */}
                            <div className="flex items-center gap-2">
                                <Globe size={16} />
                                <span className="hover:underline cursor-pointer">warga.daily/{author.uid.substring(0, 6)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center min-w-[100px]">
                        <div className="font-display font-bold text-3xl text-ink">{articles.length}</div>
                        <div className="text-xs text-neutral-500 uppercase tracking-widest">Artikel</div>
                    </div>
                </div>
            </div>

            {/* Articles Grid */}
            <div className="container mx-auto px-6 max-w-4xl">
                <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-primary rounded-full" />
                    Tulisan Terbaru
                </h2>

                <div className="grid gap-6">
                    {articles.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-neutral-200 border-dashed">
                            <p className="text-neutral-400">Belum ada artikel yang diterbitkan.</p>
                        </div>
                    ) : (
                        articles.map(article => {
                            const hasImage = !!article.meta.cover_image;

                            return (
                                <Link
                                    key={article.id}
                                    href={`/read/${article.meta.slug}`}
                                    className={cn(
                                        "group block bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-md transition-all hover:border-primary/50",
                                        !hasImage && "bg-neutral-50/50"
                                    )}
                                >
                                    <div className="flex flex-col md:flex-row h-full md:min-h-[12rem]">
                                        {/* Image Column - Only render if image exists */}
                                        {hasImage && (
                                            <div className="md:w-1/3 bg-neutral-100 relative overflow-hidden min-h-[12rem] md:min-h-0">
                                                <Image
                                                    src={article.meta.cover_image}
                                                    alt={article.meta.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                />
                                            </div>
                                        )}

                                        {/* Content Column */}
                                        <div className={cn(
                                            "flex-1 p-6 flex flex-col justify-between",
                                            !hasImage && "md:p-8"
                                        )}>
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{article.meta.tags?.[0] || "Artikel"}</span>
                                                    <span className="text-neutral-300">•</span>
                                                    <span className="text-xs text-neutral-500">
                                                        {article.editorial.published_at
                                                            ? format(article.editorial.published_at.toDate(), "d MMM yyyy", { locale: idLocale })
                                                            : "Draft"}
                                                    </span>
                                                </div>

                                                <h3 className={cn(
                                                    "font-display font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2",
                                                    hasImage ? "text-xl" : "text-2xl"
                                                )}>
                                                    {article.meta.title}
                                                </h3>

                                                <p className={cn(
                                                    "text-neutral-500 text-sm mb-4",
                                                    hasImage ? "line-clamp-2" : "line-clamp-3 text-base"
                                                )}>
                                                    {article.meta.subtitle || article.content.body.substring(0, 150).replace(/[#*`]/g, "") + "..."}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs font-bold text-ink group-hover:underline mt-auto">
                                                BACA SELENGKAPNYA
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
