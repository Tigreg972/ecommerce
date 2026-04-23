import { Controller, Post, Get, Param, Body, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.ordersService.createOrder(req.user, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@Req() req: any) {
    return this.ordersService.getOrders(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Req() req: any, @Param('id') id: string) {
    return this.ordersService.getOrderById(req.user.id, Number(id));
  }
}