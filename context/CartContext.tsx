"use client";

import React, { createContext, useContext, useReducer, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { CartItem, CartContextType } from "@/types";

const CartContext = createContext<CartContextType | null>(null);

type Action =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QTY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; payload: CartItem[] };

function cartReducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find((i) => i.id === action.payload.id);
      if (existing) {
        return state.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case "REMOVE_ITEM":
      return state.filter((i) => i.id !== action.payload);
    case "UPDATE_QTY":
      if (action.payload.quantity <= 0)
        return state.filter((i) => i.id !== action.payload.id);
      return state.map((i) =>
        i.id === action.payload.id
          ? { ...i, quantity: action.payload.quantity }
          : i
      );
    case "CLEAR":
      return [];
    case "HYDRATE":
      return action.payload;
    default:
      return state;
  }
}

const CART_KEY = "fluno_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [isOpen, setIsOpen] = useState(false);
  const hydrated = useRef(false);

  // Restore cart from localStorage on first mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CartItem[];
        if (Array.isArray(parsed) && parsed.length) {
          dispatch({ type: "HYDRATE", payload: parsed });
        }
      }
    } catch { /* corrupt data — start fresh */ }
    hydrated.current = true;
  }, []);

  // Persist cart on every change (after hydration)
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch { /* storage full/unavailable */ }
  }, [items]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem: (item) => {
          dispatch({ type: "ADD_ITEM", payload: item });
          setIsOpen(true);
          toast.success(`Added to cart`, {
            description: item.name,
            icon: "🛍️",
            duration: 2500,
          });
        },
        removeItem: (id) => {
          dispatch({ type: "REMOVE_ITEM", payload: id });
          toast("Removed from cart", { icon: "🗑️", duration: 1800 });
        },
        updateQuantity: (id, quantity) =>
          dispatch({ type: "UPDATE_QTY", payload: { id, quantity } }),
        clearCart: () => dispatch({ type: "CLEAR" }),
        total,
        itemCount,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
