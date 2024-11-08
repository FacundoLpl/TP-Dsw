import { ObjectId } from "mongodb"
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import {Entity, Property, OneToMany, Rel, Cascade, Collection} from '@mikro-orm/core'
import {Cart} from '../Cart/cart.entity.js'

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
        @OneToMany(() => Cart, (cart: Cart) => cart.user, {
                cascade: [Cascade.ALL],
        })
        carts = new Collection<Cart>(this);
}
