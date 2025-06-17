import { Entity, Property, ManyToOne, OneToMany, Cascade, Collection, Rel, Ref } from "@mikro-orm/core"

import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { User } from "../User/user.entity.js"
import { Order } from "../Order/order.entity.js"
import { ShipmentType } from "../ShipmentType/shipmentType.entity.js"
  
  
@Entity()
export class Cart extends BaseEntity {
  @Property()
  state!: string

  @Property()
  total!: number

  @Property({ nullable: true })
  deliveryType?: string

  @Property({ nullable: true })
  deliveryAddress?: string

  @Property({ nullable: true })
  paymentMethod?: string

  @Property({ nullable: true })
  contactNumber?: string

  @Property({ nullable: true })
  additionalInstructions?: string

  // Add reference to ShipmentType entity
  @ManyToOne(() => ShipmentType, { nullable: true })
  shipmentType?: ShipmentType

  // Use a string reference to break the circular dependency
  @ManyToOne(() => "User", { wrappedReference: true })
  user!: Ref<User>

  // Use a forward reference to break the circular dependency
  @OneToMany(
    () => "Order",
    (order: Order) => order.cart,
  )
  orders = new Collection<Order>(this)
}
