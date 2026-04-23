import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartItem } from '../cart/entities/cart-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepo: Repository<OrderItem>,
    @InjectRepository(CartItem)
    private readonly cartRepo: Repository<CartItem>,
  ) {}

  async createOrder(user: any, data: any) {
    const cartItems = await this.cartRepo.find({
      where: { userId: user.id },
      relations: ['product'],
    });

    if (!cartItems.length) {
      throw new BadRequestException('Cart is empty');
    }

    let totalPriceCents = 0;

    const order = this.ordersRepo.create({
      userId: user.id,
      reference: `ALT-${Date.now()}`,
      status: 'confirmed',
      totalPriceCents: 0,
    });

    const savedOrder = await this.ordersRepo.save(order);

    const itemsToSave = cartItems.map((cartItem) => {
      totalPriceCents += cartItem.product.priceCents * cartItem.quantity;

      return this.orderItemsRepo.create({
        orderId: savedOrder.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        priceCents: cartItem.product.priceCents,
      });
    });

    await this.orderItemsRepo.save(itemsToSave);

    savedOrder.totalPriceCents = totalPriceCents;
    await this.ordersRepo.save(savedOrder);

    await this.cartRepo.delete({ userId: user.id });

    const fullOrder = await this.ordersRepo.findOne({
      where: { id: savedOrder.id, userId: user.id },
      relations: ['items', 'items.product'],
    });

    return {
      ...fullOrder,
      shippingAddress: data.shippingAddress,
      payment: data.payment ?? null,
    };
  }

  async getOrders(userId: number) {
    return this.ordersRepo.find({
      where: { userId },
      relations: ['items', 'items.product'],
      order: { id: 'DESC' },
    });
  }

  async getOrderById(userId: number, id: number) {
    const order = await this.ordersRepo.findOne({
      where: { id, userId },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}