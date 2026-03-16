import { apiGet, money, firstImage, refreshCartBadges } from './api.js';

const grid = document.getElementById('grid');
const qInput = document.getElementById('q');
const sortSelect = document.getElementById('sort');
const inStock = document.getElementById('inStock');
const btn = document.getElementById('searchBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

let page = 1;
const pageSize = 12;

function getSlug() {
  const params = new URLSearchParams(location.search);
  return params.get('slug') || '';
}

function productCard(p) {
  const img = firstImage(p);
  return `
    <a class="card product-card" href="/product.html?slug=${encodeURIComponent(p.slug)}">
      <div class="card-img">${img ? `<img src="${img}" alt="">` : '🩺'}</div>
      <div class="card-body">
        <div class="muted">${p.category?.name ?? ''}</div>
        <h3>${p.name}</h3>
        <div class="price">${money(p.priceCents)}</div>
        <div class="muted">${p.stock > 0 ? `En stock (${p.stock})` : 'Rupture de stock'}</div>
      </div>
    </a>
  `;
}

function buildUrl(slug) {
  const q = encodeURIComponent(qInput.value || '');
  const sort = encodeURIComponent(sortSelect.value || 'priority');
  const stock = inStock.checked ? 'true' : 'false';

  return `/api/catalog/products?category=${encodeURIComponent(slug)}&q=${q}&sort=${sort}&inStock=${stock}&page=${page}&pageSize=${pageSize}`;
}

async function loadCategory(slug) {
  const c = await apiGet(`/api/catalog/categories/${encodeURIComponent(slug)}`);
  document.getElementById('catName').textContent = c.name;
  document.getElementById('catDesc').textContent = c.description || '';
}

async function loadProducts(slug) {
  const data = await apiGet(buildUrl(slug));
  grid.innerHTML = (data.items || []).map(productCard).join('') || `<div class="muted">Aucun produit.</div>`;
  pageInfo.textContent = `Page ${data.page} / ${data.totalPages} — ${data.total} produit(s)`;
  prevBtn.disabled = data.page <= 1;
  nextBtn.disabled = data.page >= data.totalPages || data.totalPages === 0;
}

btn.addEventListener('click', () => {
  page = 1;
  loadProducts(getSlug());
});

prevBtn.addEventListener('click', () => {
  if (page > 1) page--;
  loadProducts(getSlug());
});

nextBtn.addEventListener('click', () => {
  page++;
  loadProducts(getSlug());
});

(async () => {
  refreshCartBadges();
  const slug = getSlug();
  await loadCategory(slug);
  await loadProducts(slug);
})();