const grid = document.getElementById('grid');
const qInput = document.getElementById('q');
const catSelect = document.getElementById('category');
const sortSelect = document.getElementById('sort');
const inStock = document.getElementById('inStock');

const btn = document.getElementById('searchBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

let page = 1;
const pageSize = 12;

function money(cents) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

function card(p) {
  return `
    <article class="card">
      <div class="card-img">${p.imageUrl ? `<img src="${p.imageUrl}" alt="">` : '🛍️'}</div>
      <div class="card-body">
        <div class="muted">${p.category?.name ?? ''}</div>
        <h3>${p.name}</h3>
        <div class="price">${money(p.priceCents)}</div>
        <div class="muted">Stock: ${p.stock}</div>
      </div>
    </article>
  `;
}

async function loadCategories() {
  const res = await fetch('/api/catalog/categories');
  const cats = await res.json();

  catSelect.innerHTML =
    `<option value="">Toutes catégories</option>` +
    cats.map(c => `<option value="${c.slug}">${c.name}</option>`).join('');
}

function buildUrl() {
  const q = encodeURIComponent(qInput.value || '');
  const category = encodeURIComponent(catSelect.value || '');
  const sort = encodeURIComponent(sortSelect.value || 'newest');
  const stock = inStock.checked ? 'true' : 'false';

  return `/api/catalog/products?q=${q}&category=${category}&sort=${sort}&inStock=${stock}&page=${page}&pageSize=${pageSize}`;
}

async function loadProducts() {
  const res = await fetch(buildUrl());
  const data = await res.json();

  grid.innerHTML = data.items.map(card).join('') || `<p>Aucun produit.</p>`;

  pageInfo.textContent = `Page ${data.page} / ${data.totalPages} — ${data.total} produit(s)`;
  prevBtn.disabled = data.page <= 1;
  nextBtn.disabled = data.page >= data.totalPages || data.totalPages === 0;
}

btn.addEventListener('click', () => {
  page = 1;
  loadProducts();
});

prevBtn.addEventListener('click', () => {
  if (page > 1) page--;
  loadProducts();
});

nextBtn.addEventListener('click', () => {
  page++;
  loadProducts();
});

window.addEventListener('load', async () => {
  await loadCategories();
  await loadProducts();
});