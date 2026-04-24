import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Fingerprint, ScanFace, ChevronRight, ArrowRight, Zap, Smartphone, Wifi } from "lucide-react";
import Image from "next/image";
import { db } from "@/lib/db";
import { articles, products, heroSlides } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { formatPrice } from "@/lib/utils";
import HeroCarousel from "@/components/layout/HeroCarousel";

export default async function LandingPage() {
  const latestArticles = await db
    .select()
    .from(articles)
    .where(eq(articles.is_published, true))
    .orderBy(desc(articles.published_at))
    .limit(3);

  const featuredProducts = await db
    .select()
    .from(products)
    .limit(3);

  const activeSlides = await db
    .select()
    .from(heroSlides)
    .where(eq(heroSlides.is_active, true))
    .orderBy(desc(heroSlides.priority));

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-background">
      {/* Dynamic Hero Carousel */}
      <HeroCarousel slides={activeSlides} />

      {/* Trust & Features Section */}
      <section className="bg-background py-32 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <h2 className="font-bebas text-5xl md:text-6xl text-foreground leading-tight">
                BUILT FOR <span className="text-primary">ULTIMATE</span> <br /> PEACE OF MIND.
              </h2>
              
              <div className="space-y-8">
                <div className="flex gap-6 group">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Shield className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Hack-Proof PIN Protection</h3>
                    <p className="text-muted-foreground leading-relaxed">Our patented PIN Genie® technology ensures your access code can never be guessed or recorded by onlookers.</p>
                  </div>
                </div>
                
                <div className="flex gap-6 group">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Zap className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Real-Time Management</h3>
                    <p className="text-muted-foreground leading-relaxed">Monitor access, grant temporary eKeys, and receive instant alerts directly from your smartphone anywhere in the world.</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Lock className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Offline Capability</h3>
                    <p className="text-muted-foreground leading-relaxed">Unlike many smart locks, MW Industry systems function perfectly even without an internet connection, ensuring you're never locked out.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-[2.5rem] overflow-hidden border border-border shadow-2xl aspect-[4/5] lg:aspect-auto lg:h-[700px]">
               <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent z-10" />
               <Image 
                src="https://images.unsplash.com/photo-1558002038-1037906d8594?q=80&w=2070&auto=format&fit=crop" 
                alt="Modern Security" 
                fill 
                className="object-cover transition-transform duration-1000 hover:scale-110"
               />
               <div className="absolute bottom-12 left-12 right-12 z-20">
                  <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl">
                    <div className="text-primary font-bold uppercase tracking-widest text-xs mb-2">New Arrival</div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">The Residential Series</h3>
                    <Link href="/products" className="text-foreground flex items-center font-medium hover:text-primary transition-colors">
                      Shop Now <ChevronRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <h2 className="font-bebas text-5xl text-foreground">Featured Hardware</h2>
            <Link href="/products" className="text-primary hover:underline font-medium">View All Products</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="group">
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white border border-border mb-6 transition-all group-hover:border-primary/30 group-hover:shadow-xl">
                  {product.images && product.images[0] && (
                    <Image 
                      src={product.images[0]} 
                      alt={product.name} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-primary/90 text-white border-none">{product.category}</Badge>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-muted-foreground font-mono">{formatPrice(Number(product.price))}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News / Blog Section */}
      {latestArticles.length > 0 && (
        <section className="py-32 bg-background border-t border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-bebas text-5xl text-foreground mb-4">Security Insights</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Stay ahead with the latest in smart security, industrial safety standards, and tech updates from our experts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {latestArticles.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`} className="group flex flex-col">
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 shadow-md">
                    {article.featured_image ? (
                      <Image 
                        src={article.featured_image} 
                        alt={article.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                        <Newspaper className="w-12 h-12 text-muted-foreground opacity-20" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-3">
                    <span>{article.category || "General"}</span>
                    <span>•</span>
                    <span>{article.published_at ? new Date(article.published_at).toLocaleDateString() : ""}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
                    {article.excerpt}
                  </p>
                  <div className="mt-auto flex items-center text-foreground text-sm font-bold group-hover:translate-x-2 transition-transform">
                    Read More <ArrowRight className="ml-2 w-4 h-4 text-primary" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link href="/news">
                <Button variant="outline" className="rounded-full px-8 h-12 border-border text-foreground hover:bg-muted">
                  Browse All Articles
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden bg-muted border-t border-border">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,rgba(92,178,225,0.1),transparent_70%)]" />
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="font-bebas text-5xl md:text-7xl text-foreground mb-6">Upgrade Your <span className="text-primary">Standard</span> of Security.</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Join thousands of smart homeowners and industrial operators who trust MW Industry for their access control needs.
          </p>
          <Link href="/products">
            <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl hover:shadow-2xl transition-all">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

// Reuse component or icons from Lucide that were added
function Newspaper(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${className}`}>
      {children}
    </span>
  );
}
