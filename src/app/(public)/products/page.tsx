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
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="font-bebas text-4xl md:text-5xl tracking-wide text-foreground">
          {category ? `${category} Systems` : "All Systems"}
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Browse our comprehensive catalog of intelligent security systems. 
          Engineered for unparalleled reliability and biometric precision.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div>
            <h3 className="font-bebas text-xl tracking-wide mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/products" 
                  className={`text-sm ${!category ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link 
                  href="/products?category=Residential" 
                  className={`text-sm ${category === 'Residential' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Residential
                </Link>
              </li>
              <li>
                <Link 
                  href="/products?category=Commercial" 
                  className={`text-sm ${category === 'Commercial' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Commercial
                </Link>
              </li>
              <li>
                <Link 
                  href="/products?category=Industrial" 
                  className={`text-sm ${category === 'Industrial' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Industrial
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProducts.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-lg">
              No products found in this category.
            </div>
          ) : (
            allProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="group block h-full">
                <div className="rounded-xl border border-border/50 bg-card overflow-hidden h-full flex flex-col transition-all hover:border-primary/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                  <div className="aspect-square relative bg-secondary/20 p-6 flex items-center justify-center overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-contain p-4"
                      />
                    ) : (
                      <span className="font-bebas text-2xl opacity-20">NO IMAGE</span>
                    )}
                    {product.badge && (
                      <Badge className="absolute top-4 left-4 z-10 font-bebas tracking-wide">
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
                      {product.model_code}
                    </div>
                    <h3 className="font-bebas text-xl tracking-wide mb-2 line-clamp-2 flex-1">
                      {product.name}
                    </h3>
                    <div className="text-lg font-mono text-primary mt-4">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
