import { CartItem } from 'src/entities/cart-item/entities/cart-item.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class ShoppingCart {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    totalItems: number;

    @Column('double', { precision: 15, scale: 8 })
    totalPrices: number;

    @OneToMany(() => CartItem, cartItem => cartItem.shoppingCart)
    cartItems: CartItem[];
}
