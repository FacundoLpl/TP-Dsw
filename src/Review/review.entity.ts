import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Product } from '../Product/product.entity.js';

@Entity()
export class Review extends BaseEntity {
  @Property({ nullable: false })
  rating!: number;

  @Property({ nullable: false })
  comment!: string;

  @Property({ nullable: false })
  state!: 'Active' | 'Archived';

  @ManyToOne(() => Product, { nullable: false })
  product!: Rel<Product>;


}

