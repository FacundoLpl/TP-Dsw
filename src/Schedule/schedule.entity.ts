import {Entity, Property, ManyToOne, Rel } from '@mikro-orm/core'
import { ObjectId } from "mongodb";
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class Schedule extends BaseEntity {
    @Property()
    timeFrom!: Date 
    @Property()
    estimatedTime!: number
    @Property()
    toleranceTime!: number
    
}
