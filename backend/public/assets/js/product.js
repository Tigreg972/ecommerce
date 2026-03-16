import { apiGet, money, refreshCartBadges } from './api.js';
import { addToCart } from './cart-store.js';

function getSlug() {
  const params = new URLSearchParams(location.search);
  return params.get('slug') || '';
}

function sortImages(images) {
  return (images || []).slice().sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

function renderGallery(images) {
  const main = document.getElementById('galleryMain');
  const thumbs = document.getElementById('galleryThumbs');

  const sorted = sortImages(images);

  if (!sorted.length) {
    main.textContent = '🩺';
    thumbs.innerHTML = '';
    return;
  }

  const setMain = (url, alt) => {
    main.innerHTML = `<img src="${url}" alt="${alt || ''}">`;
  };

  setMain(sorted[0].url, sorted[0].alt);

  thumbs.innerHTML = sorted
    .map(
      (img, idx) => `
        <button class="thumb" type="button" data-url="${img.url}" data-alt="${img.alt || ''}" aria-label="Image ${idx + 1}">
          <img src="${img.url}" alt="${img.alt || ''}">
        </button>
      `,
    )
    .join('');

  thumbs.querySelectorAll('.thumb').forEach((b) => {
    b.addEventListener('click', () => {
      const url = b.getAttribute('data-url');
      const alt = b.getAttribute('data-alt');
      setMain(url, alt);
    });
  });
}

function normalizeSpecs(specs) {
  if (!specs) return '';
  const s = String(specs).trim();
  if (!s) return '';
  try {
    const obj = JSON.parse(s);
    return JSON.stringify(obj, null, 2);
  } catch {
    return s;
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value ?? '';
}

(async () => {
  refreshCartBadges();

  const slug = getSlug();
  if (!slug) {
    setText('productName', 'Produit introuvable');
    return;
  }

  let p;
  try {
    p = await apiGet(`/api/catalog/products/${encodeURIComponent(slug)}`);
  } catch {
    setText('productName', 'Produit introuvable');
    setText('productDesc', 'Ce produit n’existe pas ou a été retiré.');
    return;
  }

  setText('productCategory', p.category?.name ?? '');
  setText('productName', p.name ?? '');
  setText('productPrice', money(p.priceCents ?? 0));
  setText('productStock', (p.stock ?? 0) > 0 ? `En stock (${p.stock})` : 'Rupture de stock');
  setText('productShort', p.shortDescription ?? '');
  setText('productDesc', p.description ?? '');

  const specs = normalizeSpecs(p.techSpecs);
  const specsEl = document.getElementById('productSpecs');
  if (specsEl) {
    specsEl.textContent = specs || 'Aucune caractéristique technique renseignée.';
  }

  renderGallery(p.images || []);

  const back = document.getElementById('backToCat');
  if (back && p.category?.slug) {
    back.href = `/category.html?slug=${encodeURIComponent(p.category.slug)}`;
  }

  document.title = `Althea Systems — ${p.name ?? 'Produit'}`;

  const addBtn = document.getElementById('addToCartBtn');
  const qtyInput = document.getElementById('quantityInput');
  const addMsg = document.getElementById('addToCartMsg');

  if (addBtn) {
    if ((p.stock ?? 0) <= 0) {
      addBtn.disabled = true;
      addBtn.textContent = 'Indisponible';
    } else {
      addBtn.addEventListener('click', () => {
        const quantity = Math.max(1, Number(qtyInput?.value || 1));
        const firstImg = (p.images || []).slice().sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))[0];

        addToCart(
          {
            id: p.id,
            slug: p.slug,
            name: p.name,
            priceCents: p.priceCents,
            imageUrl: firstImg?.url || null,
            category: p.category,
            stock: p.stock,
          },
          quantity,
        );

        refreshCartBadges();

        if (addMsg) {
          addMsg.textContent = 'Produit ajouté au panier.';
          setTimeout(() => {
            addMsg.textContent = '';
          }, 2500);
        }
      });
    }
  }
})();