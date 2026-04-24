"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Megaphone } from "lucide-react";
import Link from "next/link";
import { deleteAnnouncement } from "@/app/actions/admin/announcements";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function AnnouncementList({ announcements }: { announcements: any[] }) {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    
    const res = await deleteAnnouncement(id);
    if (res.success) {
      toast.success("Announcement deleted");
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  if (announcements.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Megaphone className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-lg font-semibold mb-1">No announcements yet</h3>
          <p className="text-muted-foreground mb-6">Create your first announcement to show it on the top of the homepage.</p>
          <Link href="/admin/announcements/new">
            <Button variant="outline">Create Announcement</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {announcements.map((item) => (
        <Card key={item.id} className="overflow-hidden group hover:border-primary/40 transition-all border-border/60 shadow-sm hover:shadow-md bg-white rounded-2xl">
          <CardContent className="p-0">
            <div className="flex items-center p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mr-6 shrink-0">
                 <Megaphone className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-lg text-foreground truncate">{item.title || "Untitled Announcement"}</h3>
                  {item.is_active ? (
                    <Badge className="bg-green-500 text-white border-none text-[10px]">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">Inactive</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate font-medium">{item.subtitle || "No subtitle provided"}</p>
                <div className="flex items-center gap-6 mt-3 text-xs text-muted-foreground">
                   <div className="flex items-center gap-2">
                      <span className="opacity-60">Button:</span>
                      <span className="text-foreground font-bold">{item.button_text || "None"}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="opacity-60">Priority:</span>
                      <span className="bg-secondary px-2 py-0.5 rounded text-foreground font-bold">{item.priority}</span>
                   </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link href={`/admin/announcements/${item.id}/edit`}>
                  <Button variant="outline" size="sm" className="rounded-full px-4 hover:bg-primary hover:text-white transition-all">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full px-4 text-destructive hover:text-destructive hover:bg-destructive/5"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
