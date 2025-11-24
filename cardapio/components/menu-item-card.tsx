import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type Adicional = {
  nome: string;
  preco: number;
};

export type MenuItem = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  adicionais?: Adicional[];
};

interface MenuItemCardProps {
  item: MenuItem;
  onClick: () => void;
}

export function MenuItemCard({ item, onClick }: MenuItemCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="flex flex-col cursor-pointer hover:border-orange-400 hover:-translate-y-1 transition-transform"
    >
      <CardHeader>
        <div className="aspect-square relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imagem}
            alt={item.nome}
            className="h-full w-full object-contain"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle className="font-['Montserrat']">{item.nome}</CardTitle>
        <CardDescription className="mt-2">{item.descricao}</CardDescription>
      </CardContent>
      <CardFooter>
        <p className="text-xl font-bold text-orange-400 ml-auto">
          {item.preco.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </CardFooter>
    </Card>
  );
}
