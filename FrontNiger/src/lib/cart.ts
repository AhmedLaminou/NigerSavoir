export type CartItem = {
  bookId: number;
  quantity: number;
};

const CART_KEY = "marketplace_cart";

function readCart(): CartItem[] {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((x) => {
        const item = x as any;
        const bookId = Number(item?.bookId);
        const quantity = Number(item?.quantity);
        if (!Number.isFinite(bookId) || bookId <= 0) return null;
        if (!Number.isFinite(quantity) || quantity <= 0) return null;
        return { bookId, quantity } satisfies CartItem;
      })
      .filter(Boolean) as CartItem[];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart_changed"));
}

export function getCartItems(): CartItem[] {
  return readCart();
}

export function setCartItems(items: CartItem[]): void {
  writeCart(items);
}

export function clearCart(): void {
  writeCart([]);
}

export function addToCart(bookId: number, quantity = 1): void {
  const items = readCart();
  const existing = items.find((i) => i.bookId === bookId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ bookId, quantity });
  }
  writeCart(items);
}

export function updateCartQuantity(bookId: number, quantity: number): void {
  const items = readCart();
  const next = items
    .map((i) => (i.bookId === bookId ? { ...i, quantity } : i))
    .filter((i) => i.quantity > 0);
  writeCart(next);
}

export function removeFromCart(bookId: number): void {
  const items = readCart();
  writeCart(items.filter((i) => i.bookId !== bookId));
}

export function getCartCount(): number {
  return readCart().reduce((sum, i) => sum + i.quantity, 0);
}
