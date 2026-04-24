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
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-muted-foreground mb-8">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          </li>
          <li><ChevronRight className="h-4 w-4" /></li>
          <li>
            <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          </li>
          <li><ChevronRight className="h-4 w-4" /></li>
          <li className="text-foreground">{product.model_code}</li>
        </ol>
      </nav>

      <Link href="/products" className="inline-flex items-center text-sm text-primary hover:text-primary/80 mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalog
      </Link>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Product Images */}
        <div className="flex-1 space-y-4">
          <div className="aspect-square relative rounded-2xl border border-border/50 bg-secondary/10 flex items-center justify-center overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-contain p-8"
              />
            ) : (
              <span className="font-bebas text-3xl opacity-20">NO IMAGE</span>
            )}
            {product.badge && (
              <Badge className="absolute top-6 left-6 z-10 font-bebas text-lg tracking-wide px-3 py-1">
                {product.badge}
              </Badge>
            )}
          </div>
          {/* Thumbnails Placeholder */}
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-lg border border-border bg-secondary/20 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <span className="font-mono text-xs text-muted-foreground opacity-50">Img {i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col">
          <div className="mb-6">
            <h2 className="text-xs sm:text-sm text-primary uppercase tracking-wider font-semibold mb-2">
              {product.category}
            </h2>
            <h1 className="font-bebas text-4xl sm:text-5xl md:text-6xl tracking-wide text-foreground leading-[0.9] mb-4">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span>Model: <span className="font-mono text-foreground">{product.model_code}</span></span>
              <span className="hidden sm:inline">•</span>
              <span className={product.in_stock ? "text-green-500" : "text-destructive"}>
                {product.in_stock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>

          <div className="text-2xl sm:text-3xl font-mono text-foreground mb-6 sm:mb-8">
            {formatPrice(product.price)}
          </div>

          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
            {product.full_description || product.short_description}
          </p>

          <div className="mb-8 sm:mb-10">
            <h3 className="font-bebas text-xl sm:text-2xl tracking-wide mb-4">Key Features</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.features?.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm sm:text-base text-muted-foreground">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto pt-8 border-t border-border">
            <AddToCartButton product={{
              id: product.id,
              name: product.name,
              model_code: product.model_code,
              price: product.price,
              images: product.images,
            }} />
            <p className="text-xs text-muted-foreground text-center mt-4">
              Free secure shipping on all industrial and commercial orders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
