import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { db } from "@/lib/db";
import { announcements } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const activeAnnouncements = await db
    .select()
    .from(announcements)
    .where(eq(announcements.is_active, true))
    .orderBy(desc(announcements.priority));

  return (
    <div className="relative flex min-h-screen flex-col">
      <AnnouncementBar announcements={activeAnnouncements} />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
