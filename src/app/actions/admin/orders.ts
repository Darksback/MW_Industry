"use server";

import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await db.update(orders)
      .set({ status })
      .where(eq(orders.id, orderId));
      
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, message: "Failed to update order status" };
  }
}
