import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UnauthorizedException } from '@nestjs/common';

const mockUserRepository = () => ({
    findOne: jest.fn(),
});

describe('JwtStrategy', () => {

    let jwtStrategy: JwtStrategy;
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                { provide: UserRepository, useFactory: mockUserRepository}
            ]
        }).compile();

        jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
        userRepository = await module.get<UserRepository>(UserRepository);
    }); 

    describe('validate', () => {
        
        it('validates and returns the user base on JWT payload', async () => {
            
            const user = new User();

            user.id = 1;
            userRepository.findOne.mockResolvedValue(user);

            const result = await jwtStrategy.validate({ id: user.id});

            expect(userRepository.findOne).toHaveBeenCalledWith(user.id);
            expect(result).toEqual(user);
        });

        it('throws an unauthorized exception as user cannot be found', async () => {

            userRepository.findOne.mockResolvedValue(null);
            await expect(jwtStrategy.validate({ id: 2})).rejects.toThrow(UnauthorizedException);
        });
    });

    
});
