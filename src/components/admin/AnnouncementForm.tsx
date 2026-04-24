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
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { createAnnouncement, updateAnnouncement } from "@/app/actions/admin/announcements";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  button_text: z.string().optional(),
  button_link: z.string().optional(),
  is_active: z.boolean().default(true),
  priority: z.number().default(0),
});

type FormValues = z.infer<typeof formSchema>;

export default function AnnouncementForm({ announcement }: { announcement?: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: announcement?.title || "",
      subtitle: announcement?.subtitle || "",
      button_text: announcement?.button_text || "",
      button_link: announcement?.button_link || "",
      is_active: announcement?.is_active ?? true,
      priority: announcement?.priority ?? 0,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      let res;
      if (announcement) {
        res = await updateAnnouncement(announcement.id, values);
      } else {
        res = await createAnnouncement(values);
      }

      if (res.success) {
        toast.success(announcement ? "Announcement updated" : "Announcement created");
        router.push("/admin/announcements");
        router.refresh();
      } else {
        toast.error(res.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to save announcement");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/announcements">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-bebas tracking-wide mb-1">
            {announcement ? "Edit Announcement" : "New Announcement"}
          </h1>
          <p className="text-muted-foreground text-sm">
            Fill in the details for the announcement tile
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Announcement Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Title (Text 1)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Lockly.com Exclusive" {...field} />
                      </FormControl>
                      <FormDescription>The main highlighted text of the announcement.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Subtitle (Text 2)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Buy Zeno Series & Get Free Gifts" {...field} />
                      </FormControl>
                      <FormDescription>Secondary text shown next to the title.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="button_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clickable Text (Text 3)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Shop Now" {...field} />
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
                      <FormLabel>Forward Link</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. /products/zeno-series" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                      <FormDescription>Higher numbers show up first in the scroll.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>Show or hide this announcement on the front page.</FormDescription>
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

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Link href="/admin/announcements">
                  <Button type="button" variant="ghost">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Announcement
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
