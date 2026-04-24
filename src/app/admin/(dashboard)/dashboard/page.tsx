import { db } from "@/lib/db";
import { orders, products } from "@/lib/db/schema";
import { desc, sql } from "drizzle-orm";
import { formatPrice } from "@/lib/utils";
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
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Fetch KPI data
  const [ordersData, productsData] = await Promise.all([
    db.select().from(orders).orderBy(desc(orders.created_at)),
    db.select({ count: sql<number>`count(*)` }).from(products),
  ]);

  const totalRevenue = ordersData.reduce(
    (sum, order) => sum + Number(order.total_amount || 0),
    0
  );
  
  const pendingOrders = ordersData.filter(
    (order) => order.status?.toLowerCase() === "pending"
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-bebas tracking-wide mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store's performance and recent orders.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-border/60 shadow-sm bg-white rounded-3xl overflow-hidden group hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/20">
            <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Accumulated lifetime sales</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm bg-white rounded-3xl overflow-hidden group hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/20">
            <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm bg-white rounded-3xl overflow-hidden group hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/20">
            <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Total Products</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">{productsData[0].count}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Live items in catalog</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 shadow-sm bg-white rounded-3xl overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/20">
          <CardTitle className="font-bebas text-2xl tracking-wide">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="pl-6 font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Order Ref</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Customer</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Date</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Status</TableHead>
                  <TableHead className="text-right pr-6 font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersData.slice(0, 10).map((order) => (
                  <TableRow key={order.id} className="border-border/40 hover:bg-muted/10 transition-colors group cursor-pointer">
                    <TableCell className="pl-6">
                      <Link href={`/admin/orders/${order.id}`} className="font-bold text-primary group-hover:underline">
                        {order.order_number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/orders/${order.id}`} className="block">
                        <div className="font-bold text-foreground group-hover:text-primary transition-colors">{order.customer_name}</div>
                        <div className="text-xs text-muted-foreground font-medium">{order.customer_email}</div>
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground font-medium">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={cn(
                          "text-[10px] shadow-sm border-none",
                          order.status?.toLowerCase() === "pending" ? "bg-amber-500 text-white" : "bg-green-500 text-white"
                        )}
                      >
                        {order.status || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6 font-mono font-bold text-foreground">
                      {formatPrice(Number(order.total_amount || 0))}
                    </TableCell>
                  </TableRow>
                ))}
                
                {ordersData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                         <p className="text-lg font-bold font-bebas tracking-wide">No orders recorded</p>
                         <p className="text-sm">Store transactions will appear here.</p>
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
