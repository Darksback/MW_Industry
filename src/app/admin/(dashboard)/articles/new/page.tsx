import { ArticleForm } from "@/components/admin/ArticleForm";

export default function NewArticlePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-bebas tracking-wide mb-2">Write Article</h1>
        <p className="text-muted-foreground">Create a new blog post or news update for your customers.</p>
      </div>

      <ArticleForm />
    </div>
  );
}
