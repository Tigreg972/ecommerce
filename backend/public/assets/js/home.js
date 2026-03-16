import { apiGet, money, firstImage, refreshCartBadges } from './api.js';

function slideCard(s) {
  return `
    <article class="slide">
      <div class="slide-img" style="background-image:url('${s.imageUrl}')"></div>
      <div class="slide-body">
        <div class="slide-title">${s.title}</div>
        <div class="muted">${s.subtitle ?? ''}</div>
        ${s.ctaUrl ? `<a class="btn" href="${s.ctaUrl}">${s.ctaLabel ?? 'Découvrir'}</a>` : ''}
      </div>
    </article>
  `;
}

function categoryCard(c) {
  const bg = c.imageUrl ? `style="background-image:url('${c.imageUrl}')"` : '';
  return `
    <a class="card category-card" href="/category.html?slug=${encodeURIComponent(c.slug)}">
      <div class="cat-img" ${bg}>${c.imageUrl ? '' : '🏥'}</div>
      <div class="card-body">
        <h3>${c.name}</h3>
        <div class="muted">${c.description ?? ''}</div>
      </div>
    </a>
  `;
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

(async () => {
  refreshCartBadges();

  const data = await apiGet('/api/catalog/home');

  document.getElementById('homeText').textContent = data.homeText || '';

  const carousel = document.getElementById('carousel');
  carousel.innerHTML = (data.slides || []).map(slideCard).join('') || `<div class="muted">Aucun slide.</div>`;

  const catGrid = document.getElementById('catGrid');
  catGrid.innerHTML = (data.categories || []).map(categoryCard).join('') || `<div class="muted">Aucune catégorie.</div>`;

  const featuredGrid = document.getElementById('featuredGrid');
  featuredGrid.innerHTML = (data.featured || []).map(productCard).join('') || `<div class="muted">Aucun produit à la une.</div>`;
})();