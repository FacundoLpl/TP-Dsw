
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import {Entity, Property, OneToMany, Cascade, Collection} from '@mikro-orm/core'
import {Cart} from '../Cart/cart.entity.js'
import {Reservation} from '../Reservation/reservation.entity.js'

@Entity()
export class User extends BaseEntity{

        
        @Property({ type: 'string' })
        firstName!: string

        @Property({ type: 'string' })
        dni!: string


        @Property({ type: 'string' })
        lastName!: string

        @Property({ type: 'string' }) 
        userType!: 'Admin' | 'Client' | 'Mozo';

        @OneToMany(() => Cart, (cart: Cart) => cart.user, {
                cascade: [Cascade.ALL],
        })
        carts = new Collection<Cart>(this);

        @OneToMany(() => Reservation, (reservation: Reservation) => reservation.user, {
                cascade: [Cascade.ALL],
        })
        reservations = new Collection<Reservation>(this);

        @Property({ type: 'string', nullable: true })
        email!: string;

        @Property({ type: 'string', nullable: true })
        password!: string;

        @Property({ type: 'string', nullable: true })
        address!: string;
}
