import { Entity, Property, ManyToOne, OneToMany, Collection, Ref } from "@mikro-orm/core"
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

  @Property({nullable: true })
  deliveryType?: string

  @Property({nullable: true })
  deliveryAddress?: string

  @Property({nullable: true })
  paymentMethod?: string

  @Property({nullable: true })
  contactNumber?: string

  @Property({ nullable: true })
  additionalInstructions?: string

  // Agrega la relación con ShipmentType
  @ManyToOne(() => ShipmentType, { nullable: true })
  shipmentType?: ShipmentType

  @ManyToOne(() => "User", { wrappedReference: true })
  user!: Ref<User>
  
  @OneToMany(
    () => "Order",
    (order: Order) => order.cart,
  )
  orders = new Collection<Order>(this)
}
