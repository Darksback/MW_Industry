import { db } from "@/lib/db";
import { announcements } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import AnnouncementList from "@/components/admin/AnnouncementList";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  const allAnnouncements = await db
    .select()
    .from(announcements)
    .orderBy(desc(announcements.created_at));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-bebas tracking-wide mb-1">Announcements</h1>
          <p className="text-muted-foreground text-sm">Manage the top-page announcement tiles</p>
        </div>
        <Link href="/admin/announcements/new">
          <Button className="rounded-full px-6">
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </Link>
      </div>

      <AnnouncementList announcements={allAnnouncements} />
    </div>
  );
}
