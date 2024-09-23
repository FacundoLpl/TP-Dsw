import { Cascade, Collection, Entity, OneToMany, Property, ManyToOne } from '@mikro-orm/mongodb';
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Product } from "../Product/product.entity.js";

@Entity()
export class Category extends BaseEntity{
        @Property({nullable:false})
        catId!: string

        @Property({nullable:false})
        name!: string
        
        /*@OneToMany(() => Product, c => c.category, { cascade: [Cascade.ALL] })
        products = new Collection<Product>(this)*/
    }