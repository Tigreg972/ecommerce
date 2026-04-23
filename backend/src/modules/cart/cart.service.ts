import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../catalog/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepo: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  async getCart(userId: number) {
    return this.cartRepo.find({
      where: { userId },
      relations: ['product', 'product.images', 'product.category'],
      order: { id: 'DESC' },
    });
  }

  async addItem(userId: number, data: { productId: number; quantity: number }) {
    const product = await this.productsRepo.findOne({
      where: { id: data.productId, isActive: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.cartRepo.findOne({
      where: { userId, productId: data.productId },
    });

    if (existing) {
      existing.quantity += data.quantity;
      await this.cartRepo.save(existing);
    } else {
      const item = this.cartRepo.create({
        userId,
        productId: data.productId,
        quantity: data.quantity,
      });
      await this.cartRepo.save(item);
    }

    return this.getCart(userId);
  }

  async updateItem(userId: number, itemId: number, quantity: number) {
    const item = await this.cartRepo.findOne({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    item.quantity = quantity;
    await this.cartRepo.save(item);

    return item;
  }

  async removeItem(userId: number, itemId: number) {
    const item = await this.cartRepo.findOne({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartRepo.remove(item);
    return { success: true };
  }

  async clearCart(userId: number) {
    await this.cartRepo.delete({ userId });
    return { success: true };
  }
}