import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('featured_products')
export class FeaturedProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int' })
  productId: number;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @Column({ type: 'tinyint', default: true })
  isActive: boolean;
}