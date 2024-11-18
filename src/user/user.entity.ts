import { ObjectId } from "mongodb"
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import {Entity, Property, OneToMany, Rel, Cascade, Collection} from '@mikro-orm/core'
import {Cart} from '../Cart/cart.entity.js'
import {Reservation} from '../Reservation/reservation.entity.js'

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

        @OneToMany(() => Reservation, (reservation: Reservation) => reservation.user, {
                cascade: [Cascade.ALL],
        })
        reservations = new Collection<Reservation>(this);

        @Property({ nullable: true })
        email!: string;

        @Property({ nullable: true })
        password!: string;

        @Property({ nullable: true })
        address!: string;
}
