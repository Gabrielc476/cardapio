'use client';

import { Button } from "@/components/ui/button";
import { Cart } from "./cart";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  }

  return (
    <header className="bg-black border-b border-gray-700 p-4 flex justify-between items-center">
      <Link href="/">
        <h1 className="text-2xl font-bold text-orange-400 font-['Montserrat'] cursor-pointer">
          Cardápio
        </h1>
      </Link>
      <div className="flex gap-4 items-center">
        {isLoading ? (
          <div className="h-10 w-24 bg-gray-700 rounded animate-pulse" />
        ) : user ? (
          <>
            {user.role === 'ADMIN' && (
              <Button asChild variant="secondary">
                <Link href="/admin/dashboard">Dashboard</Link>
              </Button>
            )}
            <p>Olá, {user.name}</p>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button asChild variant="outline">
                <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
                <Link href="/register">Cadastre-se</Link>
            </Button>
          </>
        )}
        <Cart />
      </div>
    </header>
  );
}
