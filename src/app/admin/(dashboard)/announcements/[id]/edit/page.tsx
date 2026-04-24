import { db } from "@/lib/db";
import { announcements } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import AnnouncementForm from "@/components/admin/AnnouncementForm";

export default async function EditAnnouncementPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const announcement = await db.query.announcements.findFirst({
    where: eq(announcements.id, id),
  });

  if (!announcement) {
    notFound();
  }

  return <AnnouncementForm announcement={announcement} />;
}
