import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('home_carousel_slides')
export class HomeCarouselSlide {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  subtitle: string;

  @Column({ type: 'varchar', length: 600 })
  imageUrl: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  ctaLabel: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  ctaUrl: string;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @Column({ type: 'tinyint', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}