import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { HomeCarouselSlide } from './entities/home-carousel-slide.entity';
import { HomeText } from './entities/home-text.entity';
import { FeaturedProduct } from './entities/featured-product.entity';
import { QueryProductsDto } from './dto/query-products.dto';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Category) private readonly categoriesRepo: Repository<Category>,
    @InjectRepository(Product) private readonly productsRepo: Repository<Product>,
    @InjectRepository(HomeCarouselSlide) private readonly slidesRepo: Repository<HomeCarouselSlide>,
    @InjectRepository(HomeText) private readonly homeTextRepo: Repository<HomeText>,
    @InjectRepository(FeaturedProduct) private readonly featuredRepo: Repository<FeaturedProduct>,
  ) {}

  ping() {
    return { ok: true, module: 'catalog' };
  }

  async home() {
    const slides = await this.slidesRepo.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC', id: 'ASC' },
    });

    const homeText = await this.homeTextRepo.findOne({
      where: { isActive: true },
      order: { id: 'DESC' },
    });

    const categories = await this.categoriesRepo.find({
      order: { displayOrder: 'ASC', name: 'ASC' },
    });

    const featured = await this.featuredRepo.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC', id: 'ASC' },
    });

    const featuredIds = featured.map((f) => f.productId);
    const featuredProducts = featuredIds.length
      ? await this.productsRepo.find({
          where: featuredIds.map((id) => ({ id, isActive: true })),
          relations: ['category', 'images'],
        })
      : [];

    
    const featuredMap = new Map(featuredProducts.map((p) => [p.id, p]));
    const featuredOrdered = featuredIds.map((id) => featuredMap.get(id)).filter(Boolean);

    return {
      slides,
      homeText: homeText?.content ?? '',
      categories,
      featured: featuredOrdered,
    };
  }

  async listCategories() {
    return this.categoriesRepo.find({ order: { displayOrder: 'ASC', name: 'ASC' } });
  }

  
   
  async listProducts(query: QueryProductsDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 12;

    const qb = this.productsRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'c')
      .leftJoinAndSelect('p.images', 'img')
      .where('p.isActive = 1');

    if (query.category?.trim()) {
      qb.andWhere('c.slug = :slug', { slug: query.category.trim() });
    }

    if (query.inStock === true) {
      qb.andWhere('p.stock > 0');
    }

    if (typeof query.minPriceCents === 'number') {
      qb.andWhere('p.priceCents >= :minp', { minp: query.minPriceCents });
    }
    if (typeof query.maxPriceCents === 'number') {
      qb.andWhere('p.priceCents <= :maxp', { maxp: query.maxPriceCents });
    }

    const q = query.q?.trim();
    if (q) {
     
      qb.andWhere(
        '(p.name LIKE :q OR p.description LIKE :q OR p.techSpecs LIKE :q)',
        { q: `%${q}%` },
      );
    }

    
    qb.addSelect('CASE WHEN p.stock > 0 THEN 1 ELSE 0 END', 'inStockRank');

    
    switch (query.sort) {
      case 'price_asc':
        qb.orderBy('p.priceCents', 'ASC');
        break;
      case 'price_desc':
        qb.orderBy('p.priceCents', 'DESC');
        break;
      case 'name_asc':
        qb.orderBy('p.name', 'ASC');
        break;
      case 'name_desc':
        qb.orderBy('p.name', 'DESC');
        break;
      case 'priority':
      case 'relevance':
      default:
       
        qb.orderBy('p.priority', 'DESC')
          .addOrderBy('inStockRank', 'DESC')
          .addOrderBy('p.name', 'ASC');
        break;
    }

    
    qb.addOrderBy('img.displayOrder', 'ASC');

    const total = await qb.getCount();
    const items = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    const totalPages = Math.ceil(total / pageSize);

    return { items, page, pageSize, total, totalPages };
  }

  async getProductBySlug(slug: string) {
    return this.productsRepo.findOne({
      where: { slug, isActive: true },
      relations: ['category', 'images'],
    });
  }

  async getCategoryBySlug(slug: string) {
    return this.categoriesRepo.findOne({ where: { slug } });
  }
}