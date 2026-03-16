const STORAGE_KEY = 'althea_cart_v1';

function readCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('cart:updated'));
}

export function getCart() {
  return readCart();
}

export function getCartCount() {
  return readCart().reduce((sum, item) => sum + (item.quantity || 0), 0);
}

export function addToCart(product, quantity = 1) {
  const cart = readCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      slug: product.slug,
      name: product.name,
      priceCents: product.priceCents,
      imageUrl: product.imageUrl || null,
      categoryName: product.category?.name || '',
      stock: product.stock || 0,
      quantity,
    });
  }

  writeCart(cart);
}

export function updateCartItemQuantity(productId, quantity) {
  const cart = readCart().map((item) =>
    item.id === productId
      ? { ...item, quantity: Math.max(1, Number(quantity) || 1) }
      : item,
  );
  writeCart(cart);
}

export function removeFromCart(productId) {
  const cart = readCart().filter((item) => item.id !== productId);
  writeCart(cart);
}

export function clearCart() {
  writeCart([]);
}

export function getCartTotals() {
  const cart = readCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalCents = cart.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);

  return {
    items: cart,
    totalItems,
    subtotalCents,
    grandTotalCents: subtotalCents,
  };
}