import { ObjectId } from "mongodb"
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import {Entity, Property, ManyToOne, Rel } from '@mikro-orm/core'

@Entity()
export class User extends BaseEntity{
        @Property()
        dni!: string
        @Property()
        firstName!: string
        @Property()
        lastName!: string
        @Property()
        userType!: string
}
