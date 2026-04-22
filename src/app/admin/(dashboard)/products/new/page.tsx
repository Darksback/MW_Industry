"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/app/actions/admin/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
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
      setError(err instanceof Error ? err.message : "Image upload failed. Please try again.");
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
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
      short_description: formData.get("short_description") as string,
      images: imageUrl ? [imageUrl] : [],
      in_stock: true,
    };

    const result = await createProduct(data);

    if (result.success) {
      router.push("/admin/products");
    } else {
      setError(result.message || "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4">
        <Link href="/admin/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-bebas tracking-wide mb-1">Add Product</h1>
          <p className="text-muted-foreground">Create a new product in the catalog.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" name="name" required placeholder="MW-FR300 Face Recognition..." />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model_code">Model Code *</Label>
                <Input id="model_code" name="model_code" required placeholder="MW-FR300" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input id="slug" name="slug" required placeholder="mw-fr300" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (USD) *</Label>
                <Input id="price" name="price" type="number" step="0.01" required placeholder="299.99" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" placeholder="Smart Locks" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea 
                  id="short_description" 
                  name="short_description" 
                  placeholder="A brief overview of the product..."
                  rows={3}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Product Image</Label>
                <div className="flex items-center space-x-6">
                  <div className="w-32 h-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-secondary relative">
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    ) : imagePreview ? (
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    )}
                    {imageUrl && !isUploading && (
                      <div className="absolute bottom-1 left-0 right-0 text-center">
                        <span className="text-[9px] bg-green-500/80 text-white px-1 rounded">✓ Uploaded</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isUploading}
                      className="max-w-xs"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {isUploading
                        ? "Uploading to Vercel Blob CDN..."
                        : imageUrl
                        ? "Image uploaded to Vercel Blob CDN ✓"
                        : "Image will be stored on Vercel Blob CDN for fast global delivery."}
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

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {isSubmitting ? "Creating..." : isUploading ? "Uploading image..." : "Save Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
