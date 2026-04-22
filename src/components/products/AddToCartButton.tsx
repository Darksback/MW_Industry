"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/store/cart";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    model_code: string;
    price: string | number;
    images: string[] | null;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      model_code: product.model_code,
      price: Number(product.price),
      image: product.images?.[0] || "/placeholder.jpg",
      quantity: 1,
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Button 
      size="lg" 
      className="w-full h-14 text-lg mt-8" 
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
  );
}
