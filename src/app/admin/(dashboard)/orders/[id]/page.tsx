import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Package, User, MapPin, FileText } from "lucide-react";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) notFound();

  const items = await db.select().from(orderItems).where(eq(orderItems.order_id, id));

  const address = order.shipping_address;

  const statusColor: Record<string, string> = {
    pending:    "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    processing: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    shipped:    "bg-purple-500/10 text-purple-400 border-purple-500/30",
    delivered:  "bg-green-500/10 text-green-400 border-green-500/30",
    cancelled:  "bg-red-500/10 text-red-400 border-red-500/30",
  };
  const statusClass = statusColor[(order.status?.toLowerCase() ?? "pending")] ?? statusColor.pending;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold font-bebas tracking-wide">
            Order {order.order_number}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Placed on {order.created_at ? new Date(order.created_at).toLocaleString() : "N/A"}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusClass}`}>
          {order.status ?? "Pending"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Items + Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <CardTitle className="text-base">Items Ordered</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.product_name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{item.product_model}</div>
                      </TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatPrice(Number(item.unit_price))}</TableCell>
                      <TableCell className="text-right font-semibold">{formatPrice(Number(item.subtotal))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 pt-4 border-t border-border flex justify-end">
                <div className="text-right">
                  <p className="text-muted-foreground text-sm">Total</p>
                  <p className="text-2xl font-bold text-primary font-mono">
                    {formatPrice(Number(order.total_amount))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Update Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Update Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusSelect orderId={order.id} currentStatus={order.status ?? "Pending"} />
            </CardContent>
          </Card>
        </div>

        {/* Right column: Customer + Shipping + Notes */}
        <div className="space-y-6">
          {/* Customer */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-semibold">{order.customer_name}</p>
              {order.customer_company && (
                <p className="text-muted-foreground">{order.customer_company}</p>
              )}
              <p className="text-primary">{order.customer_email}</p>
              {order.customer_phone && (
                <p className="text-muted-foreground">{order.customer_phone}</p>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {address && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <CardTitle className="text-base">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1 text-muted-foreground">
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.postal_code}</p>
                <p>{address.country}</p>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {order.notes}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
