import { Entity, Property, ManyToOne } from "@mikro-orm/core";

import { BaseEntity } from "../shared/db/baseEntity.entity.js";

import { Product } from "../Product/product.entity.js";
import { User } from "../User/user.entity.js";
import { Cart } from "../Cart/cart.entity.js";
import { Rel } from '@mikro-orm/core';

@Entity()
export class Order extends BaseEntity {
  @Property({ nullable: false })
  quantity!: number;

  @ManyToOne(() => Product, { nullable: false })
  product!: Product | string;

  @Property({ nullable: true })
  subtotal!: number;

  @Property({ nullable: true })
  state!: string;

  @ManyToOne(() => Cart, { nullable: false })
  cart!: Rel<Cart>;
}
