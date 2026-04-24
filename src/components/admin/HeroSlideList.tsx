"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { deleteHeroSlide } from "@/app/actions/admin/hero";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function HeroSlideList({ slides }: { slides: any[] }) {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    
    const res = await deleteHeroSlide(id);
    if (res.success) {
      toast.success("Slide deleted");
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  if (slides.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-lg font-semibold mb-1">No hero slides yet</h3>
          <p className="text-muted-foreground mb-6">Create your first slide to show it on the homepage carousel.</p>
          <Link href="/admin/hero/new">
            <Button variant="outline">Create Slide</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-8">
      {slides.map((item) => (
        <Card key={item.id} className="overflow-hidden group hover:border-primary/40 transition-all border-border/60 shadow-sm hover:shadow-xl bg-white rounded-[2rem]">
          <CardContent className="p-0 flex flex-col lg:flex-row h-full">
            <div className="relative w-full lg:w-72 h-48 lg:h-auto bg-muted shrink-0 overflow-hidden">
               {item.image_url ? (
                 <Image src={item.image_url} alt={item.headline} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
               ) : (
                 <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-10 h-10 text-muted-foreground opacity-20" />
                 </div>
               )}
               <div className="absolute top-4 left-4">
                  {item.is_active ? (
                    <Badge className="bg-green-500 text-white border-none text-[10px] shadow-lg">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-white/80 backdrop-blur-md text-[10px]">Inactive</Badge>
                  )}
               </div>
            </div>
            <div className="flex-1 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary" className="px-3 py-1 text-[10px] uppercase tracking-[0.1em] font-bold text-primary bg-primary/5 border-primary/10">
                    {item.title || "LIFESTYLE"}
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
                  {item.headline || "Untitled Slide"}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg inline-flex">
                   <span className="font-semibold text-foreground">{item.button_text || "Learn More"}</span>
                   <span className="opacity-40">→</span>
                   <span className="truncate max-w-[200px]">{item.button_link}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/40">
                <div className="flex items-center gap-2 text-sm">
                   <span className="text-muted-foreground">Priority Order:</span>
                   <span className="bg-secondary px-2.5 py-0.5 rounded-md text-foreground font-bold">{item.priority}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Link href={`/admin/hero/${item.id}/edit`}>
                    <Button variant="outline" size="sm" className="rounded-full px-5 hover:bg-primary hover:text-white hover:border-primary transition-all">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full px-5 text-destructive hover:text-destructive hover:bg-destructive/5"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
