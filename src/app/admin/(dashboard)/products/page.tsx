import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Pencil, Package } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const productsData = await db.select().from(products).orderBy(desc(products.created_at));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-bebas tracking-wide mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <Card className="border-border/60 shadow-sm bg-white rounded-3xl overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/20">
          <CardTitle className="font-bebas text-2xl tracking-wide">Product Catalog</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="w-[80px] pl-6 font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Preview</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Product Details</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Model Code</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Unit Price</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Availability</TableHead>
                  <TableHead className="text-right pr-6 font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsData.map((product) => (
                  <TableRow key={product.id} className="border-border/40 hover:bg-muted/10 transition-colors group">
                    <TableCell className="pl-6">
                      <div className="relative w-14 h-14 bg-muted rounded-xl overflow-hidden shadow-inner shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <Image 
                            src={product.images[0]} 
                            alt={product.name} 
                            fill 
                            className="object-cover transition-transform group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground font-bold uppercase">No img</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-foreground group-hover:text-primary transition-colors min-w-[150px]">
                        {product.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs font-mono bg-muted/50 px-2 py-1 rounded border border-border/40 text-muted-foreground">
                        {product.model_code}
                      </code>
                    </TableCell>
                    <TableCell className="font-mono font-bold text-foreground">{formatPrice(Number(product.price))}</TableCell>
                    <TableCell>
                      {product.in_stock ? (
                        <Badge className="bg-green-500 text-white border-none text-[10px] shadow-sm">In Stock</Badge>
                      ) : (
                        <Badge variant="destructive" className="text-[10px] shadow-sm">Out of Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="outline" size="sm" className="rounded-full px-5 hover:bg-primary hover:text-white transition-all">
                          <Pencil className="w-3.5 h-3.5 mr-1.5" />
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                
                {productsData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                         <Package className="w-10 h-10 mb-2" />
                         <p className="text-lg font-bold font-bebas tracking-wide">No products found</p>
                         <p className="text-sm">Start by adding your first security product.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
