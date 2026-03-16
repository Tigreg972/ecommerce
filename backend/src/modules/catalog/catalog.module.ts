import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { HomeCarouselSlide } from './entities/home-carousel-slide.entity';
import { HomeText } from './entities/home-text.entity';
import { FeaturedProduct } from './entities/featured-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Product,
      ProductImage,
      HomeCarouselSlide,
      HomeText,
      FeaturedProduct,
    ]),
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}