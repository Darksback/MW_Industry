import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/ArticleForm";

export default async function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await db
    .select()
    .from(articles)
    .where(eq(articles.id, params.id))
    .limit(1);

  if (!article || article.length === 0) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-bebas tracking-wide mb-2">Edit Article</h1>
        <p className="text-muted-foreground">Modify your existing article and update its status.</p>
      </div>

      <ArticleForm initialData={article[0]} />
    </div>
  );
}
