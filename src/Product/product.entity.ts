import {Entity, Property, ManyToOne, Rel, PrimaryKey } from '@mikro-orm/core'
import { ObjectId } from 'mongodb'
import { Category } from '../Category/category.entity.js'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Product extends BaseEntity{ //faltan los atributos; como lo relaciono con categoria? avisar si no quedo bien, intente resolverlo

    @Property({ nullable: false, unique: true })
    name!: string;

    @Property({ nullable: false }) 
    price!: number;

    @Property({ nullable: false })
    stock!: number;

    @Property({ nullable: true }) 
    description?: string;

    @ManyToOne(() => Category, { nullable: false }) 
    category!: Rel<Category>;

    @Property({ nullable: true }) 
    imageUrl?: string;

    @Property({ nullable: false })
    state!: "Active" | "Archived";
}
