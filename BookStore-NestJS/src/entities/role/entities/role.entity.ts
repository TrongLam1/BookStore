import { User } from "@/entities/users/entities/user.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => User, (user) => user.roles, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    users: User[];
}