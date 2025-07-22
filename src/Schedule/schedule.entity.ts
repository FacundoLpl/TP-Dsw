import {Entity, Property, Collection, OneToMany } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Reservation } from '../Reservation/reservation.entity.js';


@Entity()
export class Schedule extends BaseEntity {
  @Property({ type: 'datetime' })
  datetime!: Date

  @Property({ type: 'number' })
  estimatedTime!: number

  @Property({ type: 'number' })
  toleranceTime!: number

  @Property({ type: 'number' })
  capacityLeft!: number

  @OneToMany(
    () => Reservation,
    (reservation: Reservation) => reservation.schedule,
  )
  reservations = new Collection<Reservation>(this)
}
