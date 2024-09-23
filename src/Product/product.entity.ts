import {Entity, Property, ManyToOne, Rel, PrimaryKey } from '@mikro-orm/core'
import { ObjectId } from 'mongodb'
import { Category } from '../Category/category.entity.js'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Product extends BaseEntity{ //faltan los atributos; como lo relaciono con categoria?

    @Property({nullable: false, unique:true}) // tiene que tener nombre y no se puede repetir
    name!: string
    @ManyToOne(() => Category, { nullable: false })
    category!: Rel<Category>
}
