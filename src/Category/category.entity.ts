import { Cascade, Collection, Entity, OneToMany, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Product } from "../Product/product.entity.js";
import { IsNotEmpty, IsString, Length } from 'class-validator';

@Entity()
export class Category extends BaseEntity {
    @Property({ nullable: false })
    @IsNotEmpty({ message: 'catId no puede estar vacío' })
    @IsString({ message: 'catId debe ser una cadena' })
    @Length(3, 10, { message: 'catId debe tener entre 3 y 10 caracteres' })
    catId!: string;

    @Property({ nullable: false })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    @IsString({ message: 'El nombre debe ser una cadena' })
    name!: string;

    @OneToMany(() => Product, product => product.category, { cascade: [Cascade.ALL] })
    products = new Collection<Product>(this);
}
