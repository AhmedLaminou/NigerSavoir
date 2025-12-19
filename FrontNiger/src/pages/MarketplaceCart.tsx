import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api, type Book } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { clearCart, getCartItems, removeFromCart, updateCartQuantity } from "@/lib/cart";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const MarketplaceCart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => getCartItems());

  useEffect(() => {
    const sync = () => setCart(getCartItems());
    window.addEventListener("storage", sync);
    window.addEventListener("cart_changed", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cart_changed", sync as EventListener);
    };
  }, []);

  const ids = useMemo(() => cart.map((i) => i.bookId), [cart]);

  const booksQuery = useQuery({
    queryKey: ["books", "cart", ids],
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

  const isEmpty = cart.length === 0;

  return (
    <div className="min-h-screen bg-background bg-pattern">
      <div className="absolute inset-0 bg-background/95" />
      <div className="relative">
        <Header />

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Votre panier</h1>
              <p className="text-muted-foreground">Gérez vos articles avant de passer commande.</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/marketplace">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Continuer les achats
              </Link>
            </Button>
          </div>

          {isEmpty ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Votre panier est vide.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                const book = booksById.get(item.bookId);
                return (
                  <Card key={item.bookId} className="premium-card">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground line-clamp-1">{book?.title || `Livre #${item.bookId}`}</h3>
                          <p className="text-sm text-muted-foreground">{book?.author || ""}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {book?.stock !== undefined && (
                              <Badge variant={book.stock > 0 ? "secondary" : "destructive"}>
                                Stock: {book.stock}
                              </Badge>
                            )}
                            <Badge variant="outline">{Number(book?.price || 0).toLocaleString()} FCFA</Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateCartQuantity(item.bookId, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <div className="min-w-[40px] text-center font-semibold">{item.quantity}</div>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateCartQuantity(item.bookId, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <Button
                            size="icon"
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            onClick={() => removeFromCart(item.bookId)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              <Card>
                <CardContent className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="text-2xl font-bold">{total.toLocaleString()} FCFA</div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => clearCart()}>
                      Vider
                    </Button>
                    <Button onClick={() => navigate("/marketplace/checkout")}>
                      Passer à la caisse
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceCart;
