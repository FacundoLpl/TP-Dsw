import {Entity, Property, Collection, OneToMany, Cascade } from '@mikro-orm/core'
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

  // Use string reference to break circular dependency
  @OneToMany(
    () => Reservation,
    (reservation: Reservation) => reservation.schedule,
  )
  reservations = new Collection<Reservation>(this)
}
