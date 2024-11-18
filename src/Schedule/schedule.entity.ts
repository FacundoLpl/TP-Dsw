import {Entity, Property, ManyToOne, Rel, Collection, OneToMany, Cascade } from '@mikro-orm/core'
import { ObjectId } from "mongodb";
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Reservation } from '../Reservation/reservation.entity.js';

@Entity()
export class Schedule extends BaseEntity {
    @Property()
    datetime!: Date 

    @Property()
    estimatedTime?: number

    @Property()
    toleranceTime?: number

    @Property()
    capacityLeft!: number    

    @OneToMany(() => Reservation, (reservation: Reservation) => reservation.schedule, {
        cascade: [Cascade.ALL],
      })
      reservations = new Collection<Reservation>(this);
}
