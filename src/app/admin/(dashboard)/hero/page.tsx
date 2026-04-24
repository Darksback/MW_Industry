import { db } from "@/lib/db";
import { heroSlides } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import HeroSlideList from "@/components/admin/HeroSlideList";

export const dynamic = "force-dynamic";

export default async function HeroPage() {
  const allSlides = await db
    .select()
    .from(heroSlides)
    .orderBy(desc(heroSlides.created_at));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-bebas tracking-wide mb-1">Hero Carousel</h1>
          <p className="text-muted-foreground text-sm">Manage the landing page slides</p>
        </div>
        <Link href="/admin/hero/new">
          <Button className="rounded-full px-6">
            <Plus className="w-4 h-4 mr-2" />
            Add New Slide
          </Button>
        </Link>
      </div>

      <HeroSlideList slides={allSlides} />
    </div>
  );
}
