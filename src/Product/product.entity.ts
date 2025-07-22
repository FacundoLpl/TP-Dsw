import {Entity, Property, ManyToOne, Rel} from '@mikro-orm/core'
import { Category } from '../Category/category.entity.js'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Product extends BaseEntity{ 

    @Property({type: 'string', nullable: false, unique: true })
    name!: string;

    @Property({ type: 'number', nullable: false }) 
    price!: number;

    @Property({ type: 'number', nullable: false })
    stock!: number;

    @Property({ type: 'string', nullable: true })
    description?: string;

    @ManyToOne(() => Category, { nullable: false }) 
    category!: Rel<Category>;

    @Property({ type: 'string', nullable: true })
    imageUrl?: string;

    @Property({ type: 'string', nullable: false })
    state!: "Active" | "Archived";
}
