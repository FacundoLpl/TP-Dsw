import {Entity, Property, ManyToOne, Rel} from '@mikro-orm/core'
import { Category } from '../Category/category.entity.js'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Product extends BaseEntity{ 

    @Property({nullable: false, unique: true })
    name!: string;

    @Property({nullable: false }) 
    price!: number;

    @Property({nullable: false })
    stock!: number;

    @Property({nullable: true })
    description?: string;

    @ManyToOne(() => Category, { nullable: false }) 
    category!: Rel<Category>;

    @Property({nullable: true })
    imageUrl?: string;

    @Property({nullable: false })
    state!: "Active" | "Archived";
}
