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
import { Plus, Pencil, Eye, Newspaper, Package } from "lucide-react";
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

      <Card className="border-border/60 shadow-sm bg-white rounded-3xl overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/20">
          <CardTitle className="font-bebas text-2xl tracking-wide">Published Content</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="w-[80px] pl-6 font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Preview</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Headline</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Category</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Status</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Date</TableHead>
                  <TableHead className="text-right pr-6 font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articlesData.map((article) => (
                  <TableRow key={article.id} className="border-border/40 hover:bg-muted/10 transition-colors group">
                    <TableCell className="pl-6">
                      <div className="relative w-14 h-14 bg-muted rounded-xl overflow-hidden shadow-inner shrink-0">
                        {article.featured_image ? (
                          <Image 
                            src={article.featured_image} 
                            alt={article.title} 
                            fill 
                            className="object-cover transition-transform group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground font-bold uppercase">No img</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-foreground line-clamp-1 min-w-[200px] group-hover:text-primary transition-colors">
                        {article.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[10px] font-bold uppercase tracking-wider">
                        {article.category || "General"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {article.is_published ? (
                        <Badge className="bg-green-500 text-white border-none text-[10px] shadow-sm">Published</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted/50 text-muted-foreground text-[10px]">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground font-medium">
                      {article.published_at ? new Date(article.published_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : "---"}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2">
                        <Link href={`/news/${article.slug}`} target="_blank">
                          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full hover:bg-primary hover:text-white transition-all">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/articles/${article.id}/edit`}>
                          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full hover:bg-primary hover:text-white transition-all">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {articlesData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                         <Newspaper className="w-10 h-10 mb-2" />
                         <p className="text-lg font-bold font-bebas tracking-wide">No articles found</p>
                         <p className="text-sm">Start by writing your first security insight.</p>
                      </div>
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
