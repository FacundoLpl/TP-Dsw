import { Entity, Property, ManyToOne, OneToMany, Cascade, Collection, Rel} from "@mikro-orm/core"

import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { User } from "../User/user.entity.js"
import { Order } from "../Order/order.entity.js"
import { ShipmentType } from "../ShipmentType/shipmentType.entity.js"
  
  @Entity()
  export class Cart extends BaseEntity {
    @Property({ nullable: false })
    state!: "Completed" | "Pending" | "Canceled";
  
    @ManyToOne(() => User, { nullable: false })
    user!: Rel<User>;
  
  
    @Property({ nullable: true })
    total!: number;
  
    @ManyToOne(() => ShipmentType, { nullable: true })
    shipmentType!: ShipmentType | null;

    @OneToMany(() => Order, (order: Order) => order.cart, {
      cascade: [Cascade.ALL],
    })
    orders = new Collection<Order>(this);
    
    @Property({ nullable: true })
    deliveryType?: string; // Tipo de envío (ejemplo: 'entrega' o 'retiro en local')

    @Property({ nullable: true })
   deliveryAddress?: string; // Dirección de entrega si el tipo de envío es "entrega"

    @Property({ nullable: true })
    paymentMethod?: string; // Método de pago (ejemplo: 'efectivo')

    @Property({ nullable: true })
    contactNumber?: string; // Número de contacto del usuario

    @Property({ nullable: true })
    additionalInstructions?: string; // Instrucciones adicionales del usuario (opcional)
  }
  