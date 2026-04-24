import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Pencil, Eye } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminArticles() {
  const articlesData = await db.select().from(articles).orderBy(desc(articles.created_at));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-bebas tracking-wide mb-2">Articles</h1>
          <p className="text-muted-foreground">Manage your blog posts and news updates.</p>
        </div>
        <Link href="/admin/articles/new">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Write Article
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articlesData.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="relative w-12 h-12 bg-secondary rounded-md overflow-hidden shrink-0">
                        {article.featured_image ? (
                          <Image 
                            src={article.featured_image} 
                            alt={article.title} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground uppercase">No img</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="min-w-[200px] line-clamp-1">{article.title}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{article.category || "Uncategorized"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={article.is_published ? "default" : "secondary"}>
                        {article.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {article.published_at ? new Date(article.published_at).toLocaleDateString() : "---"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/news/${article.slug}`} target="_blank">
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/articles/${article.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {articlesData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No articles found. Start by writing your first post!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
