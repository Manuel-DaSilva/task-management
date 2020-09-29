import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {}


    async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {

        return await this.taskRepository.getTasks(filterDto, user);
    }

    async getTaskById(id: number, user: User): Promise<Task> {

        // here if the requested task does not belong to the user that requested the service
        // a 404 response will be sent, this is to prevent the atacker to know if the task 
        // exists on the database
        // TODO add try catch and log the error properly using the logger
        // e.g. "logger.error(`failed to find task ${id} for user ${user.id}`, error.stack)"
        const found = await this.taskRepository.findOne( { where: { id, userId: user.id } } );

        if (!found) {
            throw new NotFoundException(`Id ${id} not found`);
        }
        
        return found;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {

       return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTask(id: number, user: User): Promise<void> {
        
        // TODO add try catch and log the error properly using the logger
        const result = await this.taskRepository.delete( { id, userId: user.id} );

        if (result.affected === 0) {
            throw new NotFoundException(`Id ${id} not found`);
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {

        // same situation that getting task by id, if the requested task doesnt belong to the user
        // it is not returned, insted a 404 is returned by getTaskById
        const task = await this.getTaskById(id, user);

        task.status = status;
        // TODO add try catch and log the error properly using the logger
        await task.save();
        return task;
    }   
}
