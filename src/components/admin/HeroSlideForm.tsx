"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save, Upload, Trash2 } from "lucide-react";
import Link from "next/link";
import { createHeroSlide, updateHeroSlide } from "@/app/actions/admin/hero";
import { toast } from "sonner";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().optional(), // Zeno Series
  headline: z.string().min(1, "Headline is required"), // Effortlessly Unlock
  button_text: z.string().min(1, "Button text is required"),
  button_link: z.string().min(1, "Button link is required"),
  image_url: z.string().optional(),
  bg_color: z.string(),
  is_active: z.boolean(),
  priority: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

export default function HeroSlideForm({ slide }: { slide?: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: slide?.title || "",
      headline: slide?.headline || "",
      button_text: slide?.button_text || "",
      button_link: slide?.button_link || "",
      image_url: slide?.image_url || "",
      bg_color: slide?.bg_color || "#f5f5f5",
      is_active: slide?.is_active ?? true,
      priority: slide?.priority ?? 0,
    },
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      form.setValue("image_url", data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload image";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  }

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      let res;
      if (slide) {
        res = await updateHeroSlide(slide.id, values);
      } else {
        res = await createHeroSlide(values);
      }

      if (res.success) {
        toast.success(slide ? "Slide updated" : "Slide created");
        router.push("/admin/hero");
        router.refresh();
      } else {
        toast.error(res.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to save slide");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const imageUrl = form.watch("image_url");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/hero">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-bebas tracking-wide mb-1">
            {slide ? "Edit Slide" : "New Hero Slide"}
          </h1>
          <p className="text-muted-foreground text-sm">
            Customize your homepage hero section
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Slide Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Text Content */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overline Text (Small)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Zeno Series" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="headline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Headline (Big)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Effortlessly Unlock" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="button_text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Button Text</FormLabel>
                          <FormControl>
                            <Input placeholder="Shop Now" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="button_link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Button Link</FormLabel>
                          <FormControl>
                            <Input placeholder="/products" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bg_color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Background Color</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input type="color" {...field} className="w-12 h-10 p-1" />
                              <Input {...field} placeholder="#f5f5f5" className="flex-1" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Published</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Right Column: Image Upload */}
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem className="space-y-6">
                        <FormLabel>Slide Image (Products/Main Visual)</FormLabel>
                        <FormControl>
                          <div className="relative aspect-video rounded-xl border-2 border-dashed border-border overflow-hidden bg-muted group">
                            {isUploading ? (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                              </div>
                            ) : field.value ? (
                              <>
                                <Image src={field.value} alt="Slide preview" fill className="object-contain p-4" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <Button 
                                    type="button" 
                                    variant="destructive" 
                                    size="icon"
                                    onClick={() => field.onChange("")}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                                <Upload className="w-12 h-12 mb-2 opacity-20" />
                                <p className="text-sm font-medium">Click to upload product image</p>
                                <p className="text-xs opacity-50 mt-1">PNG with transparent background is recommended</p>
                              </div>
                            )}
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                              onChange={handleImageUpload}
                              disabled={isUploading}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          For best results like the second image, use images of products with shadows and transparent backgrounds.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              <div className="flex justify-end gap-4 pt-8 border-t">
                <Link href="/admin/hero">
                  <Button type="button" variant="ghost">Cancel</Button>
                </Link>
                <Button type="submit" size="lg" className="rounded-full px-8" disabled={isSubmitting || isUploading}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Slide
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
