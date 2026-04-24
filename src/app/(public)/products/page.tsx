import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// In Next.js 15, search params and params are promises
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams.category;
  
  // Fetch products from database
  let allProducts = await db.select().from(products);
  
  if (category) {
    allProducts = allProducts.filter(p => p.category === category);
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Header */}
      <section className="relative py-24 md:py-32 overflow-hidden border-b border-border/40">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/products-hero-bg.png" 
            alt="Products Catalog Background" 
            fill 
            className="object-cover opacity-40 scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background z-10" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-20">
          <Badge variant="outline" className="mb-6 px-4 py-1 border-primary/20 text-primary uppercase tracking-[0.2em] font-bold text-[10px] rounded-full bg-background/50 backdrop-blur-sm">
            Collections
          </Badge>
          <h1 className="font-bebas text-6xl md:text-8xl tracking-tight text-foreground mb-6 drop-shadow-sm">
            {category ? `${category} Solutions` : "Smart Security Catalog"}
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-lg md:text-xl leading-relaxed font-medium">
            Experience the next generation of biometric protection. Our {category ? category.toLowerCase() : "intelligent"} systems are engineered for those who demand uncompromising security.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Navigation & Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 border-b border-border/40 pb-8">
           <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2 md:pb-0 w-full md:w-auto">
              {[
                { name: "All", href: "/products", active: !category },
                { name: "Residential", href: "/products?category=Residential", active: category === "Residential" },
                { name: "Commercial", href: "/products?category=Commercial", active: category === "Commercial" },
                { name: "Industrial", href: "/products?category=Industrial", active: category === "Industrial" },
              ].map((tab) => (
                <Link 
                  key={tab.name}
                  href={tab.href}
                  className={`px-6 py-2 rounded-full text-sm font-bold tracking-wider uppercase transition-all ${
                    tab.active 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {tab.name}
                </Link>
              ))}
           </div>
           <div className="text-sm text-muted-foreground font-medium uppercase tracking-widest hidden md:block">
              {allProducts.length} Systems Available
           </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {allProducts.length === 0 ? (
            <div className="col-span-full py-24 text-center">
              <div className="max-w-xs mx-auto opacity-20 mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-20 h-20 mx-auto">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-bebas text-2xl tracking-wide">No systems found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters or check back soon.</p>
            </div>
          ) : (
            allProducts.map((product) => (
              <div key={product.id} className="group flex flex-col h-full">
                <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] bg-[#f7f7f7] rounded-3xl overflow-hidden mb-6 transition-all hover:shadow-2xl hover:shadow-primary/5">
                  <div className="absolute inset-0 p-12 flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <span className="font-bebas text-4xl opacity-10">MW INDUSTRY</span>
                    )}
                  </div>
                  
                  {product.badge && (
                    <div className="absolute top-6 left-6 z-10 bg-white text-foreground px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                      {product.badge}
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-x-6 bottom-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <button className="w-full bg-primary text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl shadow-xl shadow-primary/20">
                      View Details
                    </button>
                  </div>
                </Link>

                <div className="flex flex-col flex-1 px-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
                      {product.model_code}
                    </span>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">
                      {product.category}
                    </span>
                  </div>
                  <Link href={`/products/${product.slug}`} className="block group/title">
                    <h3 className="font-bold text-xl leading-snug group-hover/title:text-primary transition-colors mb-2">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/40">
                    <span className="text-xl font-mono font-bold text-foreground">
                      {formatPrice(product.price)}
                    </span>
                    <div className="flex gap-1">
                       <div className="w-2.5 h-2.5 rounded-full bg-black border border-white/20" />
                       <div className="w-2.5 h-2.5 rounded-full bg-gray-400 border border-white/20" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
