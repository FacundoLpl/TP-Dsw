import { Entity, Property, ManyToOne, OneToMany, Cascade, Collection, Rel, DateTimeType} from "@mikro-orm/core"

import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { User } from "../User/user.entity.js"
import { Order } from "../Order/order.entity.js"
import { ShipmentType } from "../ShipmentType/shipmentType.entity.js"
  
  @Entity()
  export class Reservation extends BaseEntity {
    @Property({ nullable: false })
    state!: "Completed" | "Pending" | "Canceled";
  
    @ManyToOne(() => User, { nullable: false })
    user!: Rel<User>;
  
    @Property({ nullable: false })
    people!: number;

    @Property({ nullable: false })
    datetime!: DateTimeType; //Dia y hora de la reserva
  }
  