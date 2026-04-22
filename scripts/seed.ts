import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/lib/db/schema";
import bcrypt from "bcryptjs"; // Needs to be installed

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  console.log("Seeding database...");

  // Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "admin@mwindustry.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "password123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await db.insert(schema.admins).values({
    email: adminEmail,
    password_hash: passwordHash,
    name: "System Admin",
  }).onConflictDoNothing();

  console.log("Admin seeded.");

  // Seed Products
  const products = [
    {
      name: "MW-FP100 — Entry Fingerprint Lock",
      model_code: "MW-FP100",
      slug: "mw-fp100-entry-fingerprint-lock",
      category: "Residential",
      badge: "Bestseller",
      price: "249.00",
      short_description: "Reliable fingerprint access for home doors. Stores up to 100 fingerprints.",
      full_description: "The MW-FP100 offers reliable fingerprint access for home doors. Designed for security and convenience, it stores up to 100 fingerprints and features a robust anti-tamper alarm.",
      features: ["100 fingerprint capacity", "PIN backup", "auto-lock", "anti-tamper alarm", "IP65 weatherproof"],
      images: ["/placeholder.jpg"], // Use placeholder for now
      in_stock: true,
      stock_quantity: 50,
    },
    {
      name: "MW-FR300 — Face Recognition Deadbolt",
      model_code: "MW-FR300",
      slug: "mw-fr300-face-recognition-deadbolt",
      category: "Residential",
      badge: "New",
      price: "449.00",
      short_description: "3D facial recognition with liveness detection. Unlocks in under 0.5 seconds.",
      full_description: "Experience the next level of security with the MW-FR300. It features advanced 3D facial recognition with liveness detection, ensuring fast and secure access.",
      features: ["3D face scan", "liveness detection", "mobile app", "remote unlock", "50 user profiles"],
      images: ["/placeholder.jpg"],
      in_stock: true,
      stock_quantity: 30,
    },
    {
      name: "MW-CB500 — Commercial Biometric Access",
      model_code: "MW-CB500",
      slug: "mw-cb500-commercial-biometric-access",
      category: "Commercial",
      badge: "Pro",
      price: "699.00",
      short_description: "Enterprise-grade multi-modal access: face + fingerprint + PIN. Audit log included.",
      full_description: "The MW-CB500 provides enterprise-grade security with multi-modal authentication options including facial recognition, fingerprint, and PIN. Includes a comprehensive audit log.",
      features: ["Multi-modal auth", "500 user profiles", "audit log", "LDAP integration", "PoE powered"],
      images: ["/placeholder.jpg"],
      in_stock: true,
      stock_quantity: 20,
    },
    {
      name: "MW-IR800 — Industrial Reinforced Lock",
      model_code: "MW-IR800",
      slug: "mw-ir800-industrial-reinforced-lock",
      category: "Industrial",
      badge: "Pro",
      price: "1199.00",
      short_description: "Hardened steel body with biometric access for warehouses and industrial facilities.",
      full_description: "Built for extreme environments, the MW-IR800 features a hardened steel body and biometric access suitable for warehouses and industrial facilities.",
      features: ["Hardened steel", "IP68 rating", "-40°C to 70°C range", "1000 user capacity", "redundant power"],
      images: ["/placeholder.jpg"],
      in_stock: true,
      stock_quantity: 15,
    },
    {
      name: "MW-SC200 — Smart Cabinet Lock",
      model_code: "MW-SC200",
      slug: "mw-sc200-smart-cabinet-lock",
      category: "Residential",
      badge: "New",
      price: "129.00",
      short_description: "Fingerprint lock for cabinets, drawers, and safes. Rechargeable via USB-C.",
      full_description: "Secure your valuables with the MW-SC200 Smart Cabinet Lock. Designed for cabinets, drawers, and safes, it features a rechargeable battery and fingerprint authentication.",
      features: ["Compact design", "20 fingerprints", "USB-C charging", "quick-install adhesive mount"],
      images: ["/placeholder.jpg"],
      in_stock: true,
      stock_quantity: 100,
    },
    {
      name: "MW-GT900 — Gate Controller Pro",
      model_code: "MW-GT900",
      slug: "mw-gt900-gate-controller-pro",
      category: "Commercial",
      badge: "Bestseller",
      price: "899.00",
      short_description: "Full perimeter gate control with facial recognition, vehicle detection, and remote management.",
      full_description: "The MW-GT900 is a comprehensive perimeter security solution. It controls gates using facial recognition and vehicle detection, and offers full remote management capabilities.",
      features: ["Vehicle + pedestrian detection", "LTE connectivity", "solar-ready", "24/7 monitoring", "API access"],
      images: ["/placeholder.jpg"],
      in_stock: true,
      stock_quantity: 25,
    }
  ];

  for (const product of products) {
    await db.insert(schema.products).values(product).onConflictDoNothing();
  }

  console.log("Products seeded.");
  console.log("Seeding complete.");
}

main().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
