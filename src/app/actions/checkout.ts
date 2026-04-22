"use server";

import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { checkoutSchema, CheckoutInput } from "@/lib/validations";
import { generateOrderNumber } from "@/lib/utils";
import { CartItem } from "@/store/cart";

export async function submitCheckout(
  data: CheckoutInput,
  items: CartItem[]
) {
  try {
    // Validate input data on the server
    const parsedData = checkoutSchema.parse(data);
    
    if (!items || items.length === 0) {
      throw new Error("Cart is empty");
    }

    const orderNumber = generateOrderNumber();
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0).toString();

    // Execute sequentially (neon-http does not support transactions)
    // 1. Insert Order
    const [insertedOrder] = await db.insert(orders).values({
      order_number: orderNumber,
      status: "Pending",
      total_amount: totalAmount,
      customer_name: parsedData.customer_name,
      customer_email: parsedData.customer_email,
      customer_phone: parsedData.customer_phone,
      customer_company: parsedData.customer_company,
      shipping_address: parsedData.shipping_address,
      notes: parsedData.notes,
    }).returning();

    // 2. Insert Order Items
    const orderItemsToInsert = items.map(item => ({
      order_id: insertedOrder.id,
      product_id: item.product_id,
      product_name: item.name,
      product_model: item.model_code,
      quantity: item.quantity,
      unit_price: item.price.toString(),
      subtotal: (item.price * item.quantity).toString(),
    }));

    await db.insert(orderItems).values(orderItemsToInsert);

    const newOrder = insertedOrder;

    return {
      success: true,
      orderNumber: newOrder.order_number,
      message: "Order placed successfully"
    };
    
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to place order"
    };
  }
}
