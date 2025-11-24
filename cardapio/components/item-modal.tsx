'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useCart } from "@/contexts/cart-context";
import { MenuItem, Adicional } from "./menu-item-card";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Checkbox } from "./ui/checkbox";

interface ItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ItemModal({ item, isOpen, onClose }: ItemModalProps) {
  const { addToCart } = useCart();
  const [selectedAdicionais, setSelectedAdicionais] = useState<Adicional[]>([]);
  const [totalPrice, setTotalPrice] = useState(item?.preco || 0);

  useEffect(() => {
    if (item) {
      const adicionaisTotal = selectedAdicionais.reduce((total, ad) => total + ad.preco, 0);
      setTotalPrice(item.preco + adicionaisTotal);
    }
  }, [item, selectedAdicionais]);

  if (!item) {
    return null;
  }
  
  const handleAdicionalChange = (adicional: Adicional, checked: boolean) => {
    setSelectedAdicionais(prev => {
        if (checked) {
            return [...prev, adicional];
        } else {
            return prev.filter(a => a.nome !== adicional.nome);
        }
    });
  }

  const handleAddToCart = () => {
    const itemWithAdicionais = {
        ...item,
        preco: totalPrice,
        nome: `${item.nome} ${selectedAdicionais.map(a => a.nome).join(', ')}`
    }
    addToCart(itemWithAdicionais);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="aspect-video relative mb-4 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imagem} alt={item.nome} className="h-full w-full object-contain" />
          </div>
          <DialogTitle>{item.nome}</DialogTitle>
          <DialogDescription>{item.descricao}</DialogDescription>
        </DialogHeader>
        
        {item.adicionais && item.adicionais.length > 0 && (
            <div className="py-4">
                <h4 className="font-semibold mb-2">Adicionais</h4>
                <div className="space-y-2">
                    {item.adicionais.map(adicional => (
                        <div key={adicional.nome} className="flex items-center space-x-2">
                            <Checkbox 
                                id={adicional.nome}
                                onCheckedChange={(checked) => handleAdicionalChange(adicional, !!checked)}
                            />
                            <label htmlFor={adicional.nome} className="flex justify-between w-full">
                                <span>{adicional.nome}</span>
                                <span className="text-muted-foreground">
                                    {adicional.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <DialogFooter>
            <div className="w-full">
                <div className="flex justify-between items-center font-bold text-lg mb-4">
                    <span>Total</span>
                    <span>{totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
                <Button className="w-full" onClick={handleAddToCart}>
                    Adicionar ao Carrinho
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
