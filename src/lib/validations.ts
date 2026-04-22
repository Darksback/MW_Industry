import { z } from "zod";

export const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Name is required"),
  customer_email: z.string().email("Invalid email address"),
  customer_phone: z.string().min(5, "Phone number is required"),
  customer_company: z.string().optional(),
  shipping_address: z.object({
    street: z.string().min(5, "Street address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State/Province is required"),
    postal_code: z.string().min(2, "Postal code is required"),
    country: z.string().min(2, "Country is required"),
  }),
  notes: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  model_code: z.string().min(2, "Model code is required"),
  slug: z.string().min(2, "Slug is required"),
  short_description: z.string().optional(),
  full_description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.string().optional(),
  badge: z.string().optional(),
  in_stock: z.boolean().default(true),
  stock_quantity: z.coerce.number().int().min(0).default(0),
  features: z.array(z.string()).optional(),
  specifications: z.record(z.string(), z.string()).optional(),
  images: z.array(z.string()).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
