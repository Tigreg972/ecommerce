import { Controller, Get } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('ping')
  ping() {
    return this.cartService.ping();
  }
}
