import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { cn } from "@/lib/utils";


export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  const product = result[0];

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-12">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            </li>
            <li><ChevronRight className="h-3 w-3" /></li>
            <li>
              <Link href="/products" className="hover:text-primary transition-colors">Solutions</Link>
            </li>
            <li><ChevronRight className="h-3 w-3" /></li>
            <li className="text-foreground">{product.model_code}</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Product Gallery Section */}
          <div className="flex-1 lg:max-w-[55%]">
             <div className="sticky top-24 space-y-6">
                <div className="aspect-square relative rounded-[3rem] bg-[#f7f7f7] flex items-center justify-center overflow-hidden border border-border/40 shadow-sm transition-all hover:shadow-xl hover:shadow-primary/5">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      priority
                      className="object-contain p-16"
                    />
                  ) : (
                    <span className="font-bebas text-4xl opacity-10 tracking-widest text-foreground">MW INDUSTRY</span>
                  )}
                  
                  {product.badge && (
                    <div className="absolute top-10 left-10 z-10 bg-white text-foreground px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">
                      {product.badge}
                    </div>
                  )}
                </div>

                {/* Secondary Images/Feature Highlights */}
                <div className="grid grid-cols-2 gap-6">
                   <div className="aspect-[4/3] rounded-[2rem] bg-muted/30 flex items-center justify-center p-8 text-center group transition-colors hover:bg-primary/5">
                      <div className="space-y-2">
                         <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Security Grade</div>
                         <div className="font-bold text-lg">Industrial Standard</div>
                      </div>
                   </div>
                   <div className="aspect-[4/3] rounded-[2rem] bg-muted/30 flex items-center justify-center p-8 text-center group transition-colors hover:bg-primary/5">
                      <div className="space-y-2">
                         <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Biometric</div>
                         <div className="font-bold text-lg">3D Fingerprint</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Product Info Panel */}
          <div className="flex-1 flex flex-col pt-4">
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="outline" className="px-3 py-0.5 border-primary/20 text-primary uppercase tracking-[0.2em] font-bold text-[9px] rounded-full">
                  {product.category}
                </Badge>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                   Ref: {product.model_code}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-[1.1] mb-6">
                {product.name}
              </h1>

              <div className="flex items-center gap-6 mb-8">
                 <div className="text-3xl font-mono font-bold text-foreground">
                    {formatPrice(product.price)}
                 </div>
                 <div className={cn(
                   "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                   product.in_stock ? "bg-green-500/5 border-green-500/20 text-green-600" : "bg-destructive/5 border-destructive/20 text-destructive"
                 )}>
                    {product.in_stock ? "Ready to Ship" : "Currently Unavailable"}
                 </div>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.short_description || "A masterclass in security engineering, providing seamless access control with state-of-the-art biometric verification."}
                </p>
                
                {product.full_description && (
                  <p className="text-muted-foreground leading-relaxed border-l-2 border-primary/20 pl-6 italic">
                    {product.full_description}
                  </p>
                )}
              </div>
            </div>

            {/* Feature List */}
            <div className="mb-12">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground mb-6 border-b border-border/40 pb-4">
                System Capabilities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {product.features?.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary transition-transform group-hover:scale-150" />
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout Area */}
            <div className="mt-auto space-y-6">
              <div className="bg-white border border-border/60 rounded-3xl p-8 shadow-sm">
                <AddToCartButton product={{
                  id: product.id,
                  name: product.name,
                  model_code: product.model_code,
                  price: product.price,
                  images: product.images,
                  colors: product.colors || [
                    { name: "Satin Nickel", hex: "#e2e2e2" },
                    { name: "Matte Black", hex: "#222222" },
                    { name: "Venetian Bronze", hex: "#4a3b32" }
                  ],
                }} />
                
                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-border/40">
                   <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                         <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Certified Secure</span>
                   </div>
                   <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                         <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Global Warranty</span>
                   </div>
                </div>
              </div>
              
              <Link href="/products" className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group">
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                Return to Collections
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
