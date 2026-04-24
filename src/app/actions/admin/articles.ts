"use server";

import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type ArticleInput = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featured_image?: string | null;
  category?: string | null;
  is_published?: boolean;
};

export async function createArticle(data: ArticleInput) {
  try {
    const [newArticle] = await db.insert(articles).values({
      ...data,
      published_at: data.is_published ? new Date() : null,
    }).returning();

    revalidatePath("/admin/articles");
    revalidatePath("/news");
    revalidatePath("/");
    
    return { success: true, article: newArticle };
  } catch (error) {
    console.error("Failed to create article:", error);
    return { success: false, error: "Failed to create article" };
  }
}

export async function updateArticle(id: string, data: Partial<ArticleInput>) {
  try {
    const updateData: any = { ...data, updated_at: new Date() };
    
    // If we're publishing for the first time, set the published_at date
    if (data.is_published) {
      const existing = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
      if (existing.length > 0 && !existing[0].is_published) {
        updateData.published_at = new Date();
      }
    }

    const [updatedArticle] = await db
      .update(articles)
      .set(updateData)
      .where(eq(articles.id, id))
      .returning();

    revalidatePath("/admin/articles");
    revalidatePath(`/news/${updatedArticle.slug}`);
    revalidatePath("/news");
    revalidatePath("/");

    return { success: true, article: updatedArticle };
  } catch (error) {
    console.error("Failed to update article:", error);
    return { success: false, error: "Failed to update article" };
  }
}

export async function deleteArticle(id: string) {
  try {
    await db.delete(articles).where(eq(articles.id, id));
    
    revalidatePath("/admin/articles");
    revalidatePath("/news");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete article:", error);
    return { success: false, error: "Failed to delete article" };
  }
}
