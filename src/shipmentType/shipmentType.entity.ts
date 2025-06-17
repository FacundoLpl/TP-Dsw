import {Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class ShipmentType extends BaseEntity {
  @Property()
  estimatedTime!: number // verificar el tipo de dato

  @Property()
  type!: string
}
