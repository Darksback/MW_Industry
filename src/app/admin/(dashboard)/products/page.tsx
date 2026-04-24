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
import { Plus, Pencil } from "lucide-react";
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

      <Card>
        <CardHeader>
          <CardTitle>Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsData.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative w-12 h-12 bg-secondary rounded-md overflow-hidden shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <Image 
                            src={product.images[0]} 
                            alt={product.name} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">No img</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="min-w-[150px]">{product.name}</div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{product.model_code}</TableCell>
                    <TableCell className="font-mono">{formatPrice(Number(product.price))}</TableCell>
                    <TableCell>
                      <Badge variant={product.in_stock ? "default" : "destructive"} className="whitespace-nowrap">
                        {product.in_stock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="w-3.5 h-3.5 mr-1.5" />
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                
                {productsData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No products found.
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
