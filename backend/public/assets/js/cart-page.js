import { money, refreshCartBadges } from './api.js';
import {
  getCartTotals,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from './cart-store.js';

const cartEmpty = document.getElementById('cartEmpty');
const cartLayout = document.getElementById('cartLayout');
const cartItems = document.getElementById('cartItems');
const subtotal = document.getElementById('subtotal');
const totalItems = document.getElementById('totalItems');
const grandTotal = document.getElementById('grandTotal');
const clearCartBtn = document.getElementById('clearCartBtn');

function lineTotal(item) {
  return item.priceCents * item.quantity;
}

function itemCard(item) {
  return `
    <article class="card cart-item" data-id="${item.id}">
      <div class="cart-item-media">
        ${item.imageUrl ? `<img src="${item.imageUrl}" alt="">` : '🩺'}
      </div>

      <div class="cart-item-body">
        <div class="muted">${item.categoryName || ''}</div>
        <h3>${item.name}</h3>
        <div class="muted">Prix unitaire : ${money(item.priceCents)}</div>
      </div>

      <div class="cart-item-actions">
        <label class="qty-box">
          <span>Qté</span>
          <input class="qty-input" type="number" min="1" value="${item.quantity}" />
        </label>

        <div class="price">${money(lineTotal(item))}</div>

        <button class="btn btn-ghost remove-btn" type="button">Supprimer</button>
      </div>
    </article>
  `;
}

function bindEvents() {
  document.querySelectorAll('.cart-item').forEach((card) => {
    const id = Number(card.getAttribute('data-id'));
    const qtyInput = card.querySelector('.qty-input');
    const removeBtn = card.querySelector('.remove-btn');

    qtyInput?.addEventListener('change', () => {
      updateCartItemQuantity(id, Number(qtyInput.value || 1));
      render();
    });

    removeBtn?.addEventListener('click', () => {
      removeFromCart(id);
      render();
    });
  });
}

function render() {
  const totals = getCartTotals();
  refreshCartBadges();

  if (!totals.items.length) {
    cartEmpty.style.display = 'block';
    cartLayout.style.display = 'none';
    return;
  }

  cartEmpty.style.display = 'none';
  cartLayout.style.display = 'grid';

  cartItems.innerHTML = totals.items.map(itemCard).join('');
  subtotal.textContent = money(totals.subtotalCents);
  totalItems.textContent = String(totals.totalItems);
  grandTotal.textContent = money(totals.grandTotalCents);

  bindEvents();
}

clearCartBtn?.addEventListener('click', () => {
  clearCart();
  render();
});

window.addEventListener('cart:updated', render);
window.addEventListener('load', render);