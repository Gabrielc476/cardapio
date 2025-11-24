'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useCart } from "@/contexts/cart-context";
import { ShoppingCart } from "lucide-react";

export function Cart() {
  const { cartItems, removeFromCart, getCartTotal } = useCart();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Seu Carrinho</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Seu carrinho está vazio.
            </p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.nome} (x{item.quantity})</p>
                    <p className="text-sm text-muted-foreground">
                      {item.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.id)}>
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
            <div className="w-full">
                <div className="flex justify-between items-center font-bold text-lg mb-4">
                    <span>Total</span>
                    <span>{getCartTotal().toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
                <Button className="w-full" disabled={cartItems.length === 0}>
                    Finalizar Pedido
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

