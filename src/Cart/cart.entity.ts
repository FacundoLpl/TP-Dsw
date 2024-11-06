import { Entity, Property, ManyToOne, OneToMany, Cascade, Collection} from "@mikro-orm/core"

import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { User } from "../User/user.entity.js"
import { Order } from "../Order/order.entity.js"
import { ShipmentType } from "../ShipmentType/shipmentType.entity.js"
  
  @Entity()
  export class Cart extends BaseEntity {
    @Property({ nullable: false })
    state!: "Completed" | "Pending" | "Canceled";
  
    @ManyToOne(() => User, { nullable: false })
    user!: User;
  
    @OneToMany(() => Order, (order: Order) => order.cart, {cascade: [Cascade.ALL],})
    orders = new Collection<Order>(this);
  
    @Property({ nullable: false })
    total!: number;
  
    @ManyToOne(() => ShipmentType, { nullable: true })
    shipmentType!: ShipmentType | null;
  }
  