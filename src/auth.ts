import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./lib/db";
import { admins } from "./lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string() })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          console.log('[auth] Attempting login for:', email);
          
          const user = await db
            .select()
            .from(admins)
            .where(eq(admins.email, email))
            .limit(1);

          console.log('[auth] User found:', user.length > 0, '| has hash:', !!user[0]?.password_hash);

          if (user.length === 0 || !user[0].password_hash) return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            user[0].password_hash
          );

          console.log('[auth] Password match:', passwordsMatch);

          if (passwordsMatch) {
            return {
              id: user[0].id,
              email: user[0].email,
              name: user[0].name,
            };
          }
        } else {
          console.log('[auth] Zod parse failed:', parsedCredentials.error.issues);
        }
        
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
});
