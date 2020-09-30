import { User } from './../auth/user.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { TaskStatus } from './task-status.enum';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class Task extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;

    @ManyToOne(type => User, user => user.tasks, { eager: false })
    // swagger documentation
    @ApiHideProperty()
    user: User;
    
    @Column()
    userId: number;
}