import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';

const mockUser = { 
    username: 'test',
    id: 12
};

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
    updateTaskStatus: jest.fn()
});

describe('TaskService', () => {

    let tasksService;
    let taskRepository;

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository }
            ]
        }).compile(); 
    
        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository)
    });

    /*
     * Testing getTasks method 
     */
    describe('getTasks', () => {

        it('gets all taks from the repository ', async () => {

            taskRepository.getTasks.mockResolvedValue('someValue');
            expect(taskRepository.getTasks).not.toHaveBeenCalled();

            const filter: GetTaskFilterDto = {
                status: TaskStatus.IN_PROGRESS,
                search: 'query'
            };

            const result = await tasksService.getTasks(filter, mockUser);

            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue');
        });
    });

    /*
     * Testing getTaskById method 
     */
    describe('getTaskById', () => {

        const mockTask = { title: 'Test task', description: 'Test desc'};

        it('calls taskRepository.findOne() and succesfully return task', async () => {

            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await tasksService.getTaskById(1, mockUser);

            expect(result).toEqual(mockTask);
            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    userId: mockUser.id
                }
            });
        });

        it('throws an error as task is not found', async () => {

            taskRepository.findOne.mockResolvedValue(null);
            await expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    /*
     *  Testing createTask method 
     */
    describe('createTask', () => {
       
        it('Should create a new task instance', async () => {

            const title = 'test title';
            const description = 'test desc'
            const mockCreateTaskDto: CreateTaskDto = {
                title: title,
                description: description
            };
            const mockTask = { title: title, description: description};

            expect(taskRepository.createTask).not.toHaveBeenCalled();
            taskRepository.createTask.mockResolvedValue(mockTask);

            const result = await taskRepository.createTask(mockCreateTaskDto, mockUser);

            expect(taskRepository.createTask).toHaveBeenCalledWith(mockCreateTaskDto, mockUser);
            expect(result).toEqual(mockTask);
        });
    });
    
    /*
     * Testing deleteTask method 
     */
    describe('deleteTask', () => {

        it('calls taskRepository.deleteTask() to delete a task', async () => {

            taskRepository.delete.mockResolvedValue({ affected: 1});
            expect(taskRepository.delete).not.toHaveBeenCalled();
            await tasksService.deleteTask(1, mockUser);
            expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id });
        });

        it('calls taskRepository.deleteTask() to delete a task', async () => {

            taskRepository.delete.mockResolvedValue({ affected: 0 });
            await expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException)
        });
    });

    /*
     * Testing updateTaskStatus 
     */
    describe('updateTaskStatus', () => {

        it('should update the task status to DONE', async () => {

            const save = jest.fn().mockResolvedValue(true);

            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save 
            });

            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            expect(save).not.toHaveBeenCalled();
            
            const result = await tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUser);

            expect(tasksService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.DONE);
        });
    });
});
