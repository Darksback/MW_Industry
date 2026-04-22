"use server";

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createProduct(data: any) {
  try {
    await db.insert(products).values(data);
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, message: "Failed to create product. Make sure the Model Code and Slug are unique." };
  }
}

export async function updateProductStock(productId: string, inStock: boolean) {
  try {
    await db.update(products).set({ in_stock: inStock }).where(eq(products.id, productId));
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to update product stock:", error);
    return { success: false, message: "Failed to update product stock." };
  }
}

export async function deleteProduct(productId: string) {
  try {
    await db.delete(products).where(eq(products.id, productId));
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, message: "Failed to delete product." };
  }
}
