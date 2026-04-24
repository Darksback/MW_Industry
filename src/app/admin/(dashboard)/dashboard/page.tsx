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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatPrice(totalRevenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsData[0].count}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersData.slice(0, 10).map((order) => (
                  <TableRow key={order.id} className="cursor-pointer hover:bg-secondary/50 transition-colors">
                    <TableCell className="font-medium">
                      <Link href={`/admin/orders/${order.id}`} className="hover:text-primary transition-colors">
                        {order.order_number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/orders/${order.id}`} className="block">
                        <div className="whitespace-nowrap">{order.customer_name}</div>
                        <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.status?.toLowerCase() === "pending" ? "default" : "secondary"}>
                        {order.status || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatPrice(Number(order.total_amount || 0))}
                    </TableCell>
                  </TableRow>
                ))}
                
                {ordersData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No orders found.
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
