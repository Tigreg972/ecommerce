import { getCartCount } from './cart-store.js';

export async function apiGet(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function money(cents) {
  const v = (cents / 100).toFixed(2).replace('.', ',');
  return `${v} €`;
}

export function firstImage(product) {
  const imgs = product?.images || [];
  if (!imgs.length) return null;
  const sorted = imgs.slice().sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  return sorted[0]?.url || null;
}

export function refreshCartBadges() {
  const count = getCartCount();
  document.querySelectorAll('#cartCount').forEach((el) => {
    el.textContent = String(count);
    el.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

window.addEventListener('cart:updated', refreshCartBadges);
window.addEventListener('load', refreshCartBadges);