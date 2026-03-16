import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { Category } from '../modules/catalog/entities/category.entity';
import { Product } from '../modules/catalog/entities/product.entity';
import { ProductImage } from '../modules/catalog/entities/product-image.entity';
import { HomeCarouselSlide } from '../modules/catalog/entities/home-carousel-slide.entity';
import { HomeText } from '../modules/catalog/entities/home-text.entity';
import { FeaturedProduct } from '../modules/catalog/entities/featured-product.entity';

dotenv.config();

const ds = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'root',
  database: process.env.DB_NAME || 'ecommerce_db',
  entities: [Category, Product, ProductImage, HomeCarouselSlide, HomeText, FeaturedProduct],
  synchronize: true,
  logging: false,
});

async function resetDb() {
  // ✅ MySQL FK safe reset
  await ds.query('SET FOREIGN_KEY_CHECKS = 0;');

  // delete (pas truncate)
  await ds.query('DELETE FROM featured_products;');
  await ds.query('DELETE FROM product_images;');
  await ds.query('DELETE FROM products;');
  await ds.query('DELETE FROM categories;');
  await ds.query('DELETE FROM home_carousel_slides;');
  await ds.query('DELETE FROM home_text;');

  // reset auto increment (optionnel)
  await ds.query('ALTER TABLE featured_products AUTO_INCREMENT = 1;');
  await ds.query('ALTER TABLE product_images AUTO_INCREMENT = 1;');
  await ds.query('ALTER TABLE products AUTO_INCREMENT = 1;');
  await ds.query('ALTER TABLE categories AUTO_INCREMENT = 1;');
  await ds.query('ALTER TABLE home_carousel_slides AUTO_INCREMENT = 1;');
  await ds.query('ALTER TABLE home_text AUTO_INCREMENT = 1;');

  await ds.query('SET FOREIGN_KEY_CHECKS = 1;');
}

async function seed() {
  await ds.initialize();

  const catRepo = ds.getRepository(Category);
  const prodRepo = ds.getRepository(Product);
  const imgRepo = ds.getRepository(ProductImage);
  const slideRepo = ds.getRepository(HomeCarouselSlide);
  const homeTextRepo = ds.getRepository(HomeText);
  const featuredRepo = ds.getRepository(FeaturedProduct);

  await resetDb();

  // ===== HOME TEXT =====
  await homeTextRepo.save(
    homeTextRepo.create({
      content:
        "Bienvenue sur la boutique Althea Systems. Découvrez une sélection de solutions et d’équipements médicaux pensés pour les cabinets : fiabilité, sécurité et conformité.",
      isActive: true,
    }),
  );

  // ===== CAROUSEL =====
  await slideRepo.save([
    slideRepo.create({
      title: 'Équipements de pointe',
      subtitle: 'Pour optimiser la qualité de soins au cabinet.',
      imageUrl:
        'https://images.unsplash.com/photo-1580281657527-47f249e8f12d?auto=format&fit=crop&w=1600&q=60',
      ctaLabel: 'Voir les catégories',
      ctaUrl: '/#categories',
      displayOrder: 1,
      isActive: true,
    }),
    slideRepo.create({
      title: 'Fiabilité & conformité',
      subtitle: 'Sélection de matériels adaptés aux pratiques médicales.',
      imageUrl:
        'https://images.unsplash.com/photo-1582719478185-2b3fef2b1c3d?auto=format&fit=crop&w=1600&q=60',
      ctaLabel: 'Top produits',
      ctaUrl: '/#featured',
      displayOrder: 2,
      isActive: true,
    }),
    slideRepo.create({
      title: 'Support & suivi',
      subtitle: 'Une expérience d’achat simple et efficace.',
      imageUrl:
        'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1600&q=60',
      ctaLabel: 'Explorer',
      ctaUrl: '/#categories',
      displayOrder: 3,
      isActive: true,
    }),
  ]);

  // ===== CATEGORIES =====
  const categories = await catRepo.save([
    catRepo.create({
      name: 'Diagnostic',
      slug: 'diagnostic',
      description: 'Outils et dispositifs d’aide au diagnostic en cabinet.',
      imageUrl:
        'https://images.unsplash.com/photo-1581594549595-35f6edc7b762?auto=format&fit=crop&w=1200&q=60',
      displayOrder: 1,
    }),
    catRepo.create({
      name: 'Imagerie',
      slug: 'imagerie',
      description: 'Solutions d’imagerie et accessoires associés.',
      imageUrl:
        'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=60',
      displayOrder: 2,
    }),
    catRepo.create({
      name: 'Consommables',
      slug: 'consommables',
      description: 'Consommables indispensables pour la pratique médicale.',
      imageUrl:
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=60',
      displayOrder: 3,
    }),
    catRepo.create({
      name: 'Mobilier médical',
      slug: 'mobilier-medical',
      description: 'Mobilier et aménagement ergonomique du cabinet.',
      imageUrl:
        'https://images.unsplash.com/photo-1579154203451-0e8b0d8f7d9c?auto=format&fit=crop&w=1200&q=60',
      displayOrder: 4,
    }),
  ]);

  const bySlug = new Map(categories.map((c) => [c.slug, c]));

  // ===== PRODUCTS =====
  const p1 = await prodRepo.save(
    prodRepo.create({
      sku: 'ALT-DIA-001',
      name: 'Tensiomètre électronique pro',
      slug: 'tensiometre-electronique-pro',
      shortDescription: 'Mesure rapide et fiable — usage cabinet.',
      description:
        "Tensiomètre électronique adapté à un usage professionnel. Précision, confort patient et lecture claire.",
      techSpecs: `- Type : électronique
- Alimentation : secteur / batterie
- Affichage : écran LCD
- Utilisation : cabinet médical
- Conformité : CE`,
      priceCents: 14900,
      stock: 12,
      priority: 50,
      isActive: true,
      categoryId: bySlug.get('diagnostic')!.id,
    }),
  );

  const p2 = await prodRepo.save(
    prodRepo.create({
      sku: 'ALT-IMG-010',
      name: 'Échographe portable (démo)',
      slug: 'echographe-portable-demo',
      shortDescription: 'Imagerie rapide — format compact.',
      description:
        "Échographe portable (démonstration pédagogique). Solution compacte pour visualisation rapide.",
      techSpecs: `- Format : portable
- Sonde : multi-fréquences (démo)
- Connectivité : USB / Wi-Fi
- Écran : HD
- Stockage : interne`,
      priceCents: 199900,
      stock: 2,
      priority: 80,
      isActive: true,
      categoryId: bySlug.get('imagerie')!.id,
    }),
  );

  const p3 = await prodRepo.save(
    prodRepo.create({
      sku: 'ALT-CON-100',
      name: 'Gants nitrile (boîte 100)',
      slug: 'gants-nitrile-100',
      shortDescription: 'Protection et confort — usage médical.',
      description: "Gants nitrile non poudrés (boîte de 100).",
      techSpecs: `- Matière : nitrile
- Quantité : 100
- Non poudré : oui`,
      priceCents: 1299,
      stock: 0, // rupture volontaire
      priority: 10,
      isActive: true,
      categoryId: bySlug.get('consommables')!.id,
    }),
  );

  const p4 = await prodRepo.save(
    prodRepo.create({
      sku: 'ALT-MOB-200',
      name: 'Tabouret médical réglable',
      slug: 'tabouret-medical-reglable',
      shortDescription: 'Ergonomie et stabilité au cabinet.',
      description: "Tabouret médical réglable (démonstration pédagogique).",
      techSpecs: `- Réglage : hauteur
- Assise : ergonomique
- Base : stable`,
      priceCents: 8900,
      stock: 6,
      priority: 30,
      isActive: true,
      categoryId: bySlug.get('mobilier-medical')!.id,
    }),
  );

  // ===== IMAGES =====
  await imgRepo.save([
    imgRepo.create({
      productId: p1.id,
      url: 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?auto=format&fit=crop&w=1400&q=60',
      alt: 'Tensiomètre électronique',
      displayOrder: 1,
    }),
    imgRepo.create({
      productId: p1.id,
      url: 'https://images.unsplash.com/photo-1581594549595-35f6edc7b762?auto=format&fit=crop&w=1400&q=60',
      alt: 'Cabinet médical',
      displayOrder: 2,
    }),
    imgRepo.create({
      productId: p2.id,
      url: 'https://images.unsplash.com/photo-1580281657527-47f249e8f12d?auto=format&fit=crop&w=1400&q=60',
      alt: 'Échographie',
      displayOrder: 1,
    }),
    imgRepo.create({
      productId: p2.id,
      url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1400&q=60',
      alt: 'Matériel médical',
      displayOrder: 2,
    }),
    imgRepo.create({
      productId: p3.id,
      url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1400&q=60',
      alt: 'Gants nitrile',
      displayOrder: 1,
    }),
    imgRepo.create({
      productId: p4.id,
      url: 'https://images.unsplash.com/photo-1579154203451-0e8b0d8f7d9c?auto=format&fit=crop&w=1400&q=60',
      alt: 'Mobilier médical',
      displayOrder: 1,
    }),
  ]);

  // ===== FEATURED =====
  await featuredRepo.save([
    featuredRepo.create({ productId: p2.id, displayOrder: 1, isActive: true }),
    featuredRepo.create({ productId: p1.id, displayOrder: 2, isActive: true }),
    featuredRepo.create({ productId: p4.id, displayOrder: 3, isActive: true }),
  ]);

  console.log('✅ SEED OK : Home + Catégories + Produits + Images + Top produits');
  await ds.destroy();
}

seed().catch(async (e) => {
  console.error('❌ SEED FAILED:', e);
  try {
    if (ds.isInitialized) await ds.destroy();
  } catch {}
  process.exit(1);
});