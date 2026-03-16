import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 60, nullable: true })
  sku: string;

  @Column({ type: 'varchar', length: 180 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 200 })
  slug: string;

  @Column({ type: 'varchar', length: 260, nullable: true })
  shortDescription: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  
  @Column({ type: 'text', nullable: true })
  techSpecs: string;

  
  @Column({ type: 'int' })
  priceCents: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ type: 'tinyint', default: true })
  isActive: boolean;

  @Column({ type: 'int' })
  categoryId: number;

  @ManyToOne(() => Category, (c) => c.products, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => ProductImage, (img) => img.product, { cascade: true })
  images: ProductImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}