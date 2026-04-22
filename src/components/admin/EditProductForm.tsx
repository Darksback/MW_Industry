"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProduct } from "@/app/actions/admin/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  model_code: string;
  slug: string;
  price: string | number;
  category: string | null;
  short_description: string | null;
  full_description: string | null;
  badge: string | null;
  in_stock: boolean | null;
  stock_quantity: number | null;
  images: string[] | null;
};

export default function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  // Image state — start with the existing first image
  const [imageUrl, setImageUrl] = useState<string | null>(product.images?.[0] ?? null);
  const [imagePreview, setImagePreview] = useState<string | null>(product.images?.[0] ?? null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setIsUploading(true);
    setError("");

    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Upload failed");
      }

      const blob = await response.json();
      setImageUrl(blob.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
      setImagePreview(product.images?.[0] ?? null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isUploading) return;
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      model_code: formData.get("model_code") as string,
      slug: formData.get("slug") as string,
      price: formData.get("price") as string,
      category: formData.get("category") as string,
      badge: formData.get("badge") as string,
      short_description: formData.get("short_description") as string,
      full_description: formData.get("full_description") as string,
      stock_quantity: Number(formData.get("stock_quantity")),
      in_stock: formData.get("in_stock") === "true",
      images: imageUrl ? [imageUrl] : [],
    };

    const result = await updateProduct(product.id, data);

    if (result.success) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setError(result.message || "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-bebas tracking-wide mb-1">Edit Product</h1>
          <p className="text-muted-foreground text-sm">{product.model_code} — {product.name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" name="name" required defaultValue={product.name} />
              </div>

              {/* Model Code */}
              <div className="space-y-2">
                <Label htmlFor="model_code">Model Code *</Label>
                <Input id="model_code" name="model_code" required defaultValue={product.model_code} />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input id="slug" name="slug" required defaultValue={product.slug} />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD) *</Label>
                <Input id="price" name="price" type="number" step="0.01" required defaultValue={Number(product.price)} />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" defaultValue={product.category ?? ""} placeholder="Smart Locks" />
              </div>

              {/* Badge */}
              <div className="space-y-2">
                <Label htmlFor="badge">Badge</Label>
                <Input id="badge" name="badge" defaultValue={product.badge ?? ""} placeholder="New, Best Seller, etc." />
              </div>

              {/* Stock Quantity */}
              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                <Input id="stock_quantity" name="stock_quantity" type="number" defaultValue={product.stock_quantity ?? 0} />
              </div>

              {/* In Stock */}
              <div className="space-y-2">
                <Label htmlFor="in_stock">Stock Status</Label>
                <select
                  id="in_stock"
                  name="in_stock"
                  defaultValue={product.in_stock ? "true" : "false"}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>

              {/* Short Description */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  name="short_description"
                  rows={2}
                  defaultValue={product.short_description ?? ""}
                  placeholder="Brief overview shown in the product grid..."
                />
              </div>

              {/* Full Description */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="full_description">Full Description</Label>
                <Textarea
                  id="full_description"
                  name="full_description"
                  rows={5}
                  defaultValue={product.full_description ?? ""}
                  placeholder="Detailed product description shown on the product page..."
                />
              </div>

              {/* Image */}
              <div className="space-y-2 md:col-span-2">
                <Label>Product Image</Label>
                <div className="flex items-center space-x-6">
                  <div className="w-32 h-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-secondary relative">
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    ) : imagePreview ? (
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized={imagePreview.startsWith("blob:")} />
                    ) : (
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isUploading}
                      className="max-w-xs"
                    />
                    {imageUrl && !isUploading && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="flex items-center text-xs text-destructive hover:underline"
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> Remove image
                      </button>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {isUploading
                        ? "Uploading to Vercel Blob CDN..."
                        : imageUrl
                        ? "Image uploaded ✓ — select a new file to replace it."
                        : "Upload a new image to replace the current one."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-destructive text-sm font-medium p-3 bg-destructive/10 rounded-md">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Link href="/admin/products">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {isSubmitting ? "Saving..." : isUploading ? "Uploading..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
