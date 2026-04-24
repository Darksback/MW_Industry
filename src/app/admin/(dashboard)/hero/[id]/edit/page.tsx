import { db } from "@/lib/db";
import { heroSlides } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import HeroSlideForm from "@/components/admin/HeroSlideForm";

export default async function EditHeroSlidePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const slide = await db.query.heroSlides.findFirst({
    where: eq(heroSlides.id, id),
  });

  if (!slide) {
    notFound();
  }

  return <HeroSlideForm slide={slide} />;
}
