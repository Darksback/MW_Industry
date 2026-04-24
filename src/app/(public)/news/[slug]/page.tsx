import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, params.slug))
    .limit(1);

  if (!article || article.length === 0 || !article[0].is_published) {
    notFound();
  }

  const data = article[0];

  return (
    <article className="min-h-screen bg-background pt-32 pb-24">
      {/* Background Glow */}
      <div className="fixed top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] -z-10 opacity-50" />
      
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Navigation */}
        <Link 
          href="/news" 
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-12 group"
        >
          <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to News
        </Link>

        {/* Header */}
        <header className="mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8">
            {data.category || "General"}
          </div>
          
          <h1 className="font-bebas text-5xl md:text-7xl lg:text-8xl text-foreground tracking-tight leading-[0.9] mb-10">
            {data.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 text-sm text-muted-foreground border-y border-border py-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{data.published_at ? new Date(data.published_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : ""}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span>MW Industry Editorial</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {data.featured_image && (
          <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden border border-border mb-20 shadow-2xl">
            <Image 
              src={data.featured_image} 
              alt={data.title} 
              fill 
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none prose-headings:font-bebas prose-headings:tracking-wide prose-headings:font-normal prose-primary">
          <div className="text-foreground leading-[1.8] whitespace-pre-wrap text-lg sm:text-xl">
            {data.content}
          </div>
        </div>

        {/* Footer / Share */}
        <footer className="mt-24 pt-12 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="text-muted-foreground italic text-sm">
            © {new Date().getFullYear()} MW Industry. All rights reserved.
          </div>
          <div className="flex gap-4">
             <Button variant="ghost" size="icon" className="rounded-full border border-border text-muted-foreground hover:text-foreground">
                <Share2 className="w-4 h-4" />
             </Button>
          </div>
        </footer>
      </div>
    </article>
  );
}

function Button({ children, variant, size, className, ...props }: any) {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };
  const sizes = {
    icon: "h-10 w-10",
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant as keyof typeof variants]} ${sizes[size as keyof typeof sizes]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}
