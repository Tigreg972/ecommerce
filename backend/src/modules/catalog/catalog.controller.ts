import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { QueryProductsDto } from './dto/query-products.dto';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('ping')
  ping() {
    return this.catalogService.ping();
  }

  @Get('home')
  home() {
    return this.catalogService.home();
  }

  @Get('categories')
  categories() {
    return this.catalogService.listCategories();
  }

  @Get('categories/:slug')
  async category(@Param('slug') slug: string) {
    const c = await this.catalogService.getCategoryBySlug(slug);
    if (!c) throw new NotFoundException('Category not found');
    return c;
  }

  @Get('products')
  products(@Query() query: QueryProductsDto) {
    return this.catalogService.listProducts(query);
  }

  @Get('products/:slug')
  async product(@Param('slug') slug: string) {
    const p = await this.catalogService.getProductBySlug(slug);
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }
}