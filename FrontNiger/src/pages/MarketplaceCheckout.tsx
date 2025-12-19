import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api, ApiError, type Book } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { clearCart, getCartItems } from "@/lib/cart";
import { getAuthToken } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

const MarketplaceCheckout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cart] = useState(() => getCartItems());

  useEffect(() => {
    if (!getAuthToken()) {
      navigate("/login");
    }
  }, [navigate]);

  const ids = useMemo(() => cart.map((i) => i.bookId), [cart]);

  const booksQuery = useQuery({
    queryKey: ["books", "checkout", ids],
    queryFn: () => api.books.list({ ids }),
    enabled: ids.length > 0,
  });

  const booksById = useMemo(() => {
    const map = new Map<number, Book>();
    (booksQuery.data || []).forEach((b) => map.set(b.id, b));
    return map;
  }, [booksQuery.data]);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => {
      const b = booksById.get(item.bookId);
      const price = b ? Number(b.price) : 0;
      return sum + price * item.quantity;
    }, 0);
  }, [cart, booksById]);

  const createOrderMutation = useMutation({
    mutationFn: () => api.orders.create({ items: cart.map((i) => ({ bookId: i.bookId, quantity: i.quantity })) }),
    onSuccess: (order) => {
      clearCart();
      toast({
        title: "Commande créée",
        description: `Commande #${order.id} enregistrée (statut: ${order.status}).`,
      });
      navigate("/profile");
    },
    onError: (err) => {
      const message =
        err instanceof ApiError
          ? (typeof err.payload === "object" && err.payload && "error" in err.payload
              ? String((err.payload as any).error)
              : `Erreur API (${err.status})`)
          : "Impossible de créer la commande";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    },
  });

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground mb-4">Votre panier est vide.</div>
              <Button asChild variant="outline">
                <Link to="/marketplace">Retour au marketplace</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-pattern">
      <div className="absolute inset-0 bg-background/95" />
      <div className="relative">
        <Header />

        <div className="max-w-3xl mx-auto px-4 py-8">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Checkout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Paiement: placeholder (à connecter à Mobile Money/Stripe plus tard).
              </div>

              <div className="space-y-2">
                {cart.map((item) => {
                  const b = booksById.get(item.bookId);
                  return (
                    <div key={item.bookId} className="flex items-center justify-between text-sm">
                      <div className="min-w-0">
                        <div className="font-medium line-clamp-1">{b?.title || `Livre #${item.bookId}`}</div>
                        <div className="text-muted-foreground">x{item.quantity}</div>
                      </div>
                      <div className="font-semibold">
                        {(Number(b?.price || 0) * item.quantity).toLocaleString()} FCFA
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <div className="text-muted-foreground">Total</div>
                <div className="text-xl font-bold">{total.toLocaleString()} FCFA</div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" asChild>
                  <Link to="/marketplace/cart">Retour</Link>
                </Button>
                <Button
                  onClick={() => createOrderMutation.mutate()}
                  disabled={createOrderMutation.isPending || booksQuery.isLoading}
                >
                  Confirmer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceCheckout;
