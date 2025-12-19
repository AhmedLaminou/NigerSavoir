import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api, ApiError, type BookReactionSummary, type ReactionType } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToCart, getCartCount } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, ShoppingCart, ThumbsDown, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";

const Marketplace = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [cartCount, setCartCount] = useState(() => getCartCount());

  useEffect(() => {
    const sync = () => setCartCount(getCartCount());
    window.addEventListener("storage", sync);
    window.addEventListener("cart_changed", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cart_changed", sync as EventListener);
    };
  }, []);

  const booksQuery = useQuery({
    queryKey: ["books", q],
    queryFn: () => api.books.list({ q: q || undefined }),
  });

  const books = useMemo(() => booksQuery.data || [], [booksQuery.data]);

  const visibleBookIds = useMemo(() => books.map((b) => b.id), [books]);
  const reactionsQueryKey = useMemo(() => ["reactions", "books", visibleBookIds], [visibleBookIds]);

  const reactionsQuery = useQuery({
    queryKey: reactionsQueryKey,
    queryFn: () => api.reactions.booksSummary(visibleBookIds),
    enabled: visibleBookIds.length > 0,
  });

  const reactionsByBookId = useMemo(() => {
    const map = new Map<number, BookReactionSummary>();
    (reactionsQuery.data || []).forEach((s) => map.set(s.bookId, s));
    return map;
  }, [reactionsQuery.data]);

  const reactionMutation = useMutation({
    mutationFn: (vars: { bookId: number; reactionType: ReactionType }) =>
      api.reactions.setBookReaction(vars.bookId, vars.reactionType),
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: reactionsQueryKey });
      const previous = queryClient.getQueryData<BookReactionSummary[]>(reactionsQueryKey);
      if (!previous) return { previous };

      queryClient.setQueryData<BookReactionSummary[]>(reactionsQueryKey, (old) => {
        const current = old || [];
        return current.map((s) => {
          if (s.bookId !== vars.bookId) return s;

          const myReaction = s.myReaction || null;
          const target = vars.reactionType;
          let likeCount = s.likeCount;
          let dislikeCount = s.dislikeCount;
          let nextMyReaction: ReactionType | null = target;

          if (myReaction === target) {
            nextMyReaction = null;
            if (target === "LIKE") likeCount = Math.max(0, likeCount - 1);
            if (target === "DISLIKE") dislikeCount = Math.max(0, dislikeCount - 1);
          } else {
            if (myReaction === "LIKE") likeCount = Math.max(0, likeCount - 1);
            if (myReaction === "DISLIKE") dislikeCount = Math.max(0, dislikeCount - 1);
            if (target === "LIKE") likeCount = likeCount + 1;
            if (target === "DISLIKE") dislikeCount = dislikeCount + 1;
          }

          return { ...s, likeCount, dislikeCount, myReaction: nextMyReaction };
        });
      });

      return { previous };
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre réaction",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: reactionsQueryKey });
    },
  });

  const toggleReaction = (bookId: number, reactionType: ReactionType) => {
    if (!isLoggedIn()) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour liker ou disliker un livre.",
        variant: "destructive",
      });
      return;
    }
    reactionMutation.mutate({ bookId, reactionType });
  };

  const onAddToCart = (bookId: number) => {
    addToCart(bookId, 1);
    toast({
      title: "Ajouté au panier",
      description: "Le livre a été ajouté à votre panier.",
    });
  };

  const errorMessage = useMemo(() => {
    if (!booksQuery.error) return null;
    const err = booksQuery.error;
    if (err instanceof ApiError) {
      if (typeof err.payload === "object" && err.payload && "error" in err.payload) {
        return String((err.payload as any).error);
      }
      return `Erreur API (${err.status})`;
    }
    return "Erreur lors du chargement des livres";
  }, [booksQuery.error]);

  return (
    <div className="min-h-screen bg-background bg-pattern">
      <div className="absolute inset-0 bg-background/95" />
      <div className="relative">
        <Header />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 gradient-text">Marketplace</h1>
              <p className="text-muted-foreground text-lg">Achetez des livres et supports pédagogiques</p>
            </div>

            <Button asChild variant="outline" className="shadow-sm">
              <Link to="/marketplace/cart">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Panier
                <span className="ml-2">({cartCount})</span>
              </Link>
            </Button>
          </div>

          <div className="glass-card p-4 rounded-xl mb-6">
            <div className="flex gap-3">
              <Input
                placeholder="Rechercher un livre (titre ou auteur)"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <Button variant="outline" onClick={() => setQ("")}>Effacer</Button>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 text-sm text-destructive">{errorMessage}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((b) => (
              <Card key={b.id} className="premium-card border-2 hover:border-primary/30">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-lg text-foreground line-clamp-2">{b.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{b.author}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0">{b.stock > 0 ? "En stock" : "Rupture"}</Badge>
                  </div>

                  {b.description && (
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-3">{b.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    {b.subject && <Badge variant="secondary">{b.subject}</Badge>}
                    {b.level && <Badge variant="secondary">{b.level}</Badge>}
                    {b.school?.name && <Badge variant="outline">{b.school.name}</Badge>}
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="text-lg font-bold text-foreground">{Number(b.price).toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={reactionsByBookId.get(b.id)?.myReaction === "LIKE" ? "default" : "outline"}
                        onClick={() => toggleReaction(b.id, "LIKE")}
                        className="shadow-sm"
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        {reactionsByBookId.get(b.id)?.likeCount ?? 0}
                      </Button>
                      <Button
                        size="sm"
                        variant={reactionsByBookId.get(b.id)?.myReaction === "DISLIKE" ? "destructive" : "outline"}
                        onClick={() => toggleReaction(b.id, "DISLIKE")}
                        className="shadow-sm"
                      >
                        <ThumbsDown className="w-4 h-4 mr-2" />
                        {reactionsByBookId.get(b.id)?.dislikeCount ?? 0}
                      </Button>
                      <Button size="sm" disabled={b.stock <= 0} onClick={() => onAddToCart(b.id)}>
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {!booksQuery.isLoading && books.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">Aucun livre trouvé.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
