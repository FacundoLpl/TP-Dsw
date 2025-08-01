import { Entity, Property, ManyToOne, Ref } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Product } from "../Product/product.entity.js";
import { Cart } from "../Cart/cart.entity.js";

@Entity()
export class Order extends BaseEntity {
  @Property()
  quantity!: number

  @Property()
  subtotal!: number

  @Property({nullable: true })
  comment?: string

  @Property({nullable: true })
  productName?: string

  @ManyToOne(() => Product)
  product!: Product

  @ManyToOne(() => "Cart", { wrappedReference: true })
  cart!: Ref<Cart>
}
