"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch for persisted store
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total = getTotal();

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-5xl">
      <h1 className="font-bebas text-4xl md:text-5xl tracking-wide text-foreground mb-8">
        Your Cart
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-16 border border-border/50 rounded-xl bg-card">
          <p className="text-muted-foreground text-lg mb-6">Your cart is currently empty.</p>
          <Link href="/products">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            <div className="hidden sm:grid grid-cols-12 gap-4 text-sm uppercase tracking-wider text-muted-foreground font-semibold pb-4 border-b border-border">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
            </div>

            {items.map((item) => (
              <div key={item.product_id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-6 border-b border-border/50">
                {/* Product Info */}
                <div className="col-span-1 sm:col-span-6 flex items-center gap-4">
                  <div className="w-20 h-20 bg-secondary/20 rounded-md border border-border flex items-center justify-center shrink-0">
                    <span className="text-[8px] font-mono opacity-30">NO IMG</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground line-clamp-2">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 font-mono">{item.model_code}</p>
                    <p className="text-sm text-primary mt-1 sm:hidden">{formatPrice(item.price)}</p>
                  </div>
                </div>

                {/* Quantity */}
                <div className="col-span-1 sm:col-span-3 flex justify-between sm:justify-center items-center">
                  <span className="sm:hidden text-sm text-muted-foreground">Quantity:</span>
                  <div className="flex items-center border border-border rounded-md">
                    <button
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-mono text-sm">{item.quantity}</span>
                    <button
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Total & Remove */}
                <div className="col-span-1 sm:col-span-3 flex justify-between sm:justify-end items-center">
                  <span className="sm:hidden text-sm text-muted-foreground">Total:</span>
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-medium">{formatPrice(item.price * item.quantity)}</span>
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-2"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="rounded-xl border border-border bg-card p-6 sticky top-24">
              <h2 className="font-bebas text-2xl tracking-wide mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono text-foreground">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                
                <div className="pt-4 mt-4 border-t border-border flex justify-between items-end">
                  <span className="text-base font-medium">Estimated Total</span>
                  <span className="text-2xl font-mono text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <Link href="/checkout" className="block mt-8">
                <Button size="lg" className="w-full h-14 text-lg">
                  Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <div className="mt-6 flex items-start gap-3 text-xs text-muted-foreground bg-secondary/30 p-3 rounded-lg border border-border/50">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                <p>
                  Secure checkout. We only collect contact and delivery information. 
                  A sales representative will contact you for payment processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
