import {
  pgTable,
  varchar,
  text,
  boolean,
  integer,
  numeric,
  jsonb,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  model_code: varchar("model_code", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  short_description: text("short_description"),
  full_description: text("full_description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 100 }),
  badge: varchar("badge", { length: 50 }),
  in_stock: boolean("in_stock").default(true),
  stock_quantity: integer("stock_quantity").default(0),
  features: jsonb("features").$type<string[]>(),
  specifications: jsonb("specifications").$type<Record<string, string>>(),
  images: jsonb("images").$type<string[]>(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  order_number: varchar("order_number", { length: 20 }),
  customer_name: varchar("customer_name", { length: 255 }).notNull(),
  customer_email: varchar("customer_email", { length: 255 }).notNull(),
  customer_phone: varchar("customer_phone", { length: 50 }),
  customer_company: varchar("customer_company", { length: 255 }),
  shipping_address: jsonb("shipping_address").$type<{
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  }>(),
  notes: text("notes"),
  status: varchar("status", { length: 50 }).default("pending"),
  total_amount: numeric("total_amount", { precision: 10, scale: 2 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  order_id: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }),
  product_id: uuid("product_id").references(() => products.id),
  product_name: varchar("product_name", { length: 255 }),
  product_model: varchar("product_model", { length: 100 }),
  unit_price: numeric("unit_price", { precision: 10, scale: 2 }),
  quantity: integer("quantity").notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }),
});

export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: text("password_hash"),
  name: varchar("name", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
});
