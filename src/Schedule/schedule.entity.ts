import {Entity, Property, Collection, OneToMany } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Reservation } from '../Reservation/reservation.entity.js';


@Entity()
export class Schedule extends BaseEntity {
  @Property()
  datetime!: Date

  @Property()
   estimatedTime!: number

  @Property()
   toleranceTime!: number

  @Property()
   capacityLeft!: number

  @OneToMany(
    () => Reservation,
    (reservation: Reservation) => reservation.schedule,
  )
  reservations = new Collection<Reservation>(this)
}
