"use server";

import { db } from "@/lib/db";
import { heroSlides } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getHeroSlides() {
  try {
    const data = await db
      .select()
      .from(heroSlides)
      .where(eq(heroSlides.is_active, true))
      .orderBy(desc(heroSlides.priority));
    return { success: true, data };
  } catch (error) {
    console.error("[getHeroSlides]", error);
    return { success: false, error: "Failed to fetch hero slides" };
  }
}

export async function createHeroSlide(values: any) {
  try {
    await db.insert(heroSlides).values(values);
    revalidatePath("/");
    revalidatePath("/admin/hero");
    return { success: true };
  } catch (error) {
    console.error("[createHeroSlide]", error);
    return { success: false, error: "Failed to create hero slide" };
  }
}

export async function updateHeroSlide(id: string, values: any) {
  try {
    await db
      .update(heroSlides)
      .set({ ...values, updated_at: new Date() })
      .where(eq(heroSlides.id, id));
    revalidatePath("/");
    revalidatePath("/admin/hero");
    return { success: true };
  } catch (error) {
    console.error("[updateHeroSlide]", error);
    return { success: false, error: "Failed to update hero slide" };
  }
}

export async function deleteHeroSlide(id: string) {
  try {
    await db.delete(heroSlides).where(eq(heroSlides.id, id));
    revalidatePath("/");
    revalidatePath("/admin/hero");
    return { success: true };
  } catch (error) {
    console.error("[deleteHeroSlide]", error);
    return { success: false, error: "Failed to delete hero slide" };
  }
}
