import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Fingerprint, ScanFace, ChevronRight, ArrowRight, Zap, Smartphone, Wifi } from "lucide-react";
import Image from "next/image";
import { db } from "@/lib/db";
import { articles, products } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { formatPrice } from "@/lib/utils";

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

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Premium Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-16 overflow-hidden">
        {/* Background elements - sleek and dark */}
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(0,111,207,0.15),transparent_50%)]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-10 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span>The Standard in Smart Security</span>
              </div>
              
              <h1 className="font-bebas text-7xl md:text-[120px] tracking-tight text-white leading-[0.85]">
                LIMITLESS <br />
                <span className="text-primary italic">SECURITY.</span>
              </h1>
              
              <p className="max-w-xl text-lg md:text-xl text-gray-400 leading-relaxed mx-auto lg:mx-0">
                MW Industry redefines access with world-class biometric engineering. 
                Experience the perfect fusion of military-grade protection and 
                seamless design for your home and business.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
                <Link href="/products">
                  <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-primary hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,111,207,0.4)]">
                    Explore Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/news">
                  <Button size="lg" variant="ghost" className="h-16 px-8 text-lg text-white hover:bg-white/5 rounded-full border border-white/10">
                    Latest Insights
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="relative aspect-square max-w-[600px] mx-auto">
                {/* Floating animated elements */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full animate-pulse opacity-50 blur-3xl" />
                
                {/* Product Showcase Visual */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                   <div className="w-[300px] h-[550px] bg-card border border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                      {/* Glossy overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                      
                      {/* Top Scanner */}
                      <div className="mt-12 mx-auto w-32 h-32 rounded-full border border-primary/30 flex items-center justify-center bg-black/40 relative">
                        <ScanFace className="w-12 h-12 text-primary animate-pulse" />
                        <div className="absolute inset-[-4px] border border-primary/20 rounded-full animate-spin-slow" />
                      </div>

                      <div className="mt-8 px-8 text-center space-y-4">
                        <div className="text-primary font-bebas text-3xl tracking-widest uppercase">Titan X1</div>
                        <div className="text-gray-400 text-sm">3D Facial Recognition Smart Lock</div>
                        <div className="pt-4 flex justify-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                              <Fingerprint className="w-5 h-5 text-gray-300" />
                           </div>
                           <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                              <Wifi className="w-5 h-5 text-gray-300" />
                           </div>
                           <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                              <Smartphone className="w-5 h-5 text-gray-300" />
                           </div>
                        </div>
                      </div>

                      {/* Handle Visual */}
                      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-12 bg-gradient-to-b from-gray-700 to-black rounded-full border border-white/5 shadow-lg" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Features Section */}
      <section className="bg-black py-32 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <h2 className="font-bebas text-5xl md:text-6xl text-white leading-tight">
                BUILT FOR <span className="text-primary">ULTIMATE</span> <br /> PEACE OF MIND.
              </h2>
              
              <div className="space-y-8">
                <div className="flex gap-6 group">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Shield className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Hack-Proof PIN Protection</h3>
                    <p className="text-gray-400 leading-relaxed">Our patented PIN Genie® technology ensures your access code can never be guessed or recorded by onlookers.</p>
                  </div>
                </div>
                
                <div className="flex gap-6 group">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Zap className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Real-Time Management</h3>
                    <p className="text-gray-400 leading-relaxed">Monitor access, grant temporary eKeys, and receive instant alerts directly from your smartphone anywhere in the world.</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Lock className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Offline Capability</h3>
                    <p className="text-gray-400 leading-relaxed">Unlike many smart locks, MW Industry systems function perfectly even without an internet connection, ensuring you're never locked out.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 aspect-[4/5] lg:aspect-auto lg:h-[700px]">
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
               <Image 
                src="https://images.unsplash.com/photo-1558002038-1037906d8594?q=80&w=2070&auto=format&fit=crop" 
                alt="Modern Security" 
                fill 
                className="object-cover transition-transform duration-1000 hover:scale-110"
               />
               <div className="absolute bottom-12 left-12 right-12 z-20">
                  <div className="p-8 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10">
                    <div className="text-primary font-bold uppercase tracking-widest text-xs mb-2">New Arrival</div>
                    <h3 className="text-2xl font-bold text-white mb-4">The Residential Series</h3>
                    <Link href="/products" className="text-white flex items-center font-medium hover:text-primary transition-colors">
                      Shop Now <ChevronRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-32 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <h2 className="font-bebas text-5xl text-white">Featured Hardware</h2>
            <Link href="/products" className="text-primary hover:underline font-medium">View All Products</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="group">
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-card border border-white/5 mb-6 transition-all group-hover:border-primary/30">
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
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-gray-400 font-mono">{formatPrice(Number(product.price))}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News / Blog Section */}
      {latestArticles.length > 0 && (
        <section className="py-32 bg-black border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-bebas text-5xl text-white mb-4">Security Insights</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Stay ahead with the latest in smart security, industrial safety standards, and tech updates from our experts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {latestArticles.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`} className="group flex flex-col">
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
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
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                    {article.excerpt}
                  </p>
                  <div className="mt-auto flex items-center text-white text-sm font-bold group-hover:translate-x-2 transition-transform">
                    Read More <ArrowRight className="ml-2 w-4 h-4 text-primary" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link href="/news">
                <Button variant="outline" className="rounded-full px-8 h-12 border-white/10 text-white hover:bg-white/5">
                  Browse All Articles
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden bg-primary/10 border-t border-primary/20">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,rgba(0,111,207,0.2),transparent_70%)]" />
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="font-bebas text-5xl md:text-7xl text-white mb-6">Upgrade Your <span className="text-primary">Standard</span> of Security.</h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Join thousands of smart homeowners and industrial operators who trust MW Industry for their access control needs.
          </p>
          <Link href="/products">
            <Button size="lg" className="h-16 px-12 text-lg rounded-full shadow-[0_0_30px_rgba(0,111,207,0.3)]">
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
