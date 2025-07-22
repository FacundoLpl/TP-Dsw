import {Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class ShipmentType extends BaseEntity {
  @Property({ type: 'number' })
  estimatedTime!: number 

  @Property({ type: 'string' })
  type!: string
}
