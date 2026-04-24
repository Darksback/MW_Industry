"use server";

import { db } from "@/lib/db";
import { announcements } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAnnouncements() {
  try {
    const data = await db
      .select()
      .from(announcements)
      .where(eq(announcements.is_active, true))
      .orderBy(desc(announcements.priority));
    return { success: true, data };
  } catch (error) {
    console.error("[getAnnouncements]", error);
    return { success: false, error: "Failed to fetch announcements" };
  }
}

export async function createAnnouncement(values: any) {
  try {
    await db.insert(announcements).values(values);
    revalidatePath("/");
    revalidatePath("/admin/announcements");
    return { success: true };
  } catch (error) {
    console.error("[createAnnouncement]", error);
    return { success: false, error: "Failed to create announcement" };
  }
}

export async function updateAnnouncement(id: string, values: any) {
  try {
    await db
      .update(announcements)
      .set({ ...values, updated_at: new Date() })
      .where(eq(announcements.id, id));
    revalidatePath("/");
    revalidatePath("/admin/announcements");
    return { success: true };
  } catch (error) {
    console.error("[updateAnnouncement]", error);
    return { success: false, error: "Failed to update announcement" };
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    await db.delete(announcements).where(eq(announcements.id, id));
    revalidatePath("/");
    revalidatePath("/admin/announcements");
    return { success: true };
  } catch (error) {
    console.error("[deleteAnnouncement]", error);
    return { success: false, error: "Failed to delete announcement" };
  }
}
