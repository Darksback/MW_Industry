import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Newspaper, Calendar, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const allArticles = await db
    .select()
    .from(articles)
    .where(eq(articles.is_published, true))
    .orderBy(desc(articles.published_at));

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <h1 className="font-bebas text-6xl md:text-8xl text-foreground tracking-tight mb-6">
            SECURITY <span className="text-primary italic">INSIGHTS.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            The latest updates in smart access technology, industrial safety protocols, 
            and modern residential security trends from the MW Industry engineering team.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {allArticles.map((article) => (
            <Link 
              key={article.id} 
              href={`/news/${article.slug}`} 
              className="group flex flex-col bg-white border border-border rounded-[2.5rem] overflow-hidden transition-all hover:border-primary/30 hover:shadow-2xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {article.featured_image ? (
                  <Image 
                    src={article.featured_image} 
                    alt={article.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-secondary/50 flex items-center justify-center">
                    <Newspaper className="w-16 h-16 text-primary opacity-20" />
                  </div>
                )}
                <div className="absolute top-6 left-6">
                  <div className="px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/20 text-primary text-xs font-bold uppercase tracking-widest">
                    {article.category || "General"}
                  </div>
                </div>
              </div>
              
              <div className="p-10 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {article.published_at ? new Date(article.published_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : ""}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                  {article.title}
                </h2>
                
                <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-8">
                  {article.excerpt}
                </p>
                
                <div className="mt-auto flex items-center text-foreground font-bold group-hover:translate-x-2 transition-transform">
                  Read Article <ArrowRight className="ml-2 w-5 h-5 text-primary" />
                </div>
              </div>
            </Link>
          ))}
          
          {allArticles.length === 0 && (
            <div className="col-span-full py-32 text-center border border-dashed border-border rounded-[3rem]">
              <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-foreground mb-2">No Articles Yet</h3>
              <p className="text-muted-foreground">Check back soon for the latest security updates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
