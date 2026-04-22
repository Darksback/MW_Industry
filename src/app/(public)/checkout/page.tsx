"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations";
import { submitCheckout } from "@/app/actions/checkout";
import { formatPrice } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"; // Assuming sonner is installed via shadcn, if not we will handle it

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Redirect if cart is empty
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      customer_company: "",
      shipping_address: {
        street: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
      },
      notes: "",
    },
  });

  const onSubmit = async (data: CheckoutInput) => {
    setIsSubmitting(true);
    
    try {
      const result = await submitCheckout(data, items);
      
      if (result.success) {
        clearCart();
        router.push(`/order-confirmed?order=${result.orderNumber}`);
      } else {
        toast.error(result.message || "Failed to place order");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || items.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-7xl">
      <div className="mb-10 text-center">
        <h1 className="font-bebas text-4xl md:text-5xl tracking-wide text-foreground">Secure Checkout</h1>
        <p className="text-muted-foreground mt-2">Please provide your contact and delivery details.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Checkout Form */}
        <div className="flex-1">
          <div className="bg-card border border-border/50 rounded-xl p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Contact Information */}
                <div>
                  <h2 className="font-bebas text-2xl tracking-wide mb-4 border-b border-border pb-2">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="customer_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customer_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customer_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+1 (555) 000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customer_company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Corp" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h2 className="font-bebas text-2xl tracking-wide mb-4 border-b border-border pb-2">Delivery Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="shipping_address.street"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St, Suite 100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shipping_address.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Detroit" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shipping_address.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State / Province</FormLabel>
                          <FormControl>
                            <Input placeholder="MI" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shipping_address.postal_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="48202" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shipping_address.country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="United States" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <h2 className="font-bebas text-2xl tracking-wide mb-4 border-b border-border pb-2">Additional Information</h2>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Special delivery instructions or requirements..." 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full h-14 text-lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-secondary/20 border border-border/50 rounded-xl p-6 sticky top-24">
            <h2 className="font-bebas text-2xl tracking-wide mb-6">Order Summary</h2>
            
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-6">
              {items.map((item) => (
                <div key={item.product_id} className="flex gap-4">
                  <div className="w-16 h-16 bg-background rounded border border-border flex items-center justify-center shrink-0">
                    <span className="text-[6px] font-mono opacity-30 text-center">NO IMG</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                    <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                      <span>Qty: {item.quantity}</span>
                      <span className="font-mono">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm border-t border-border/50 pt-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono text-foreground">{formatPrice(getTotal())}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>TBD</span>
              </div>
              
              <div className="pt-3 mt-3 border-t border-border flex justify-between items-end">
                <span className="text-base font-medium">Total</span>
                <span className="text-2xl font-mono text-primary">{formatPrice(getTotal())}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-background/50 rounded-lg border border-border text-sm text-muted-foreground flex gap-3 items-start">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <p>
                No payment is required today. After order placement, our team will review your request and contact you to arrange payment and delivery logistics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
