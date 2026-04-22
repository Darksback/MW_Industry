import Link from "next/link";
import { CheckCircle2, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const orderNumber = resolvedSearchParams.order || "MWI-XXXXXX";

  return (
    <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8 max-w-3xl flex flex-col items-center text-center">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative">
        <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20" />
        <CheckCircle2 className="h-12 w-12 text-primary" />
      </div>

      <h1 className="font-bebas text-5xl md:text-6xl tracking-wide text-foreground mb-4">
        Order Confirmed
      </h1>
      
      <p className="text-xl text-muted-foreground mb-2">
        Thank you for choosing MW Industry.
      </p>
      
      <div className="bg-secondary/20 border border-border/50 rounded-xl p-6 my-10 w-full max-w-md">
        <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Order Reference Number</p>
        <p className="font-mono text-3xl text-foreground font-semibold tracking-widest">{orderNumber}</p>
      </div>

      <div className="space-y-4 max-w-xl text-muted-foreground mb-12">
        <p>
          We have received your order details. Due to the high-security nature of our products and customized fulfillment requirements, your order is currently pending review.
        </p>
        <p>
          A dedicated sales representative will contact you within 24 business hours at the email or phone number provided to arrange secure payment and finalize delivery logistics.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/products">
          <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg">
            Return to Catalog <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg">
          <Download className="mr-2 h-5 w-5" /> Download Receipt
        </Button>
      </div>
    </div>
  );
}
