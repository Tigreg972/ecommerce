import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('items')
  addItem(@Req() req: any, @Body() body: { productId: number; quantity: number }) {
    return this.cartService.addItem(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('items/:id')
  updateItem(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { quantity: number },
  ) {
    return this.cartService.updateItem(req.user.id, Number(id), body.quantity);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('items/:id')
  removeItem(@Req() req: any, @Param('id') id: string) {
    return this.cartService.removeItem(req.user.id, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user.id);
  }
}