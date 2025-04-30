import { Entity, Property, ManyToOne, Rel} from "@mikro-orm/core"
import { Schedule } from "../Schedule/schedule.entity.js"

import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { User } from "../User/user.entity.js"
  
  @Entity()
  export class Reservation extends BaseEntity {
    @Property({ nullable: false })
    state!: "Completed" | "Pending" | "Canceled";
  
    @ManyToOne(() => User, { nullable: false })
    user!: Rel<User>;
  
    @Property({ nullable: false })
    people!: number;

    @Property({ nullable: false })
    datetime!: Date; //Dia y hora de la reserva

    @ManyToOne(() => Schedule, { nullable: false })
    schedule!: Rel<Schedule>;
  }
  