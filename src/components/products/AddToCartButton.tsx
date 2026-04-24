"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    model_code: string;
    price: string | number;
    images: string[] | null;
    colors?: { name: string; hex: string }[] | null;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0].name : undefined;
  const [selectedColor, setSelectedColor] = useState<string | undefined>(defaultColor);
  
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      model_code: product.model_code,
      price: Number(product.price),
      image: product.images?.[0] || "/placeholder.jpg",
      quantity,
      color: selectedColor,
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleIncrease = () => {
    if (quantity < 10) setQuantity(q => q + 1);
  };

  return (
    <div className="space-y-8">
      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">Color</h4>
            <span className="text-sm font-medium text-muted-foreground">{selectedColor}</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={cn(
                  "group relative w-12 h-12 rounded-full flex items-center justify-center transition-all",
                  selectedColor === color.name ? "ring-2 ring-primary ring-offset-4 ring-offset-background" : "hover:ring-2 hover:ring-border hover:ring-offset-2"
                )}
                aria-label={`Select ${color.name}`}
              >
                <span 
                  className="w-10 h-10 rounded-full shadow-inner border border-border/20 transition-transform group-hover:scale-95" 
                  style={{ backgroundColor: color.hex }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center justify-between border border-border/60 rounded-xl px-2 h-14 bg-background w-full sm:w-36 shrink-0">
          <button 
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-mono text-lg font-bold w-8 text-center">{quantity}</span>
          <button 
            onClick={handleIncrease}
            disabled={quantity >= 10}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <Button 
          size="lg" 
          className="flex-1 h-14 text-base font-bold uppercase tracking-widest rounded-xl transition-all hover:shadow-lg hover:shadow-primary/20" 
          onClick={handleAddToCart}
          disabled={isAdded}
        >
          {isAdded ? (
            <>
              <Check className="mr-2 h-5 w-5" /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
