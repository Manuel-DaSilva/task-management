import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

const mockCredentialsDto = { username: 'test', password: 'password'};

describe('UserRepository', () => {

    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserRepository,
            ]
        }).compile();

        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('signUp', () => {

        let save = jest.fn();

        beforeEach(() => {
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({ save });
        });

        it('successfully signs up the user', async () => {

            save.mockResolvedValue({ success: true });
            await expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
        });

        it('throws a conflic exception as username already exists', async () => {

            save.mockRejectedValue({ code: '23505'});
            await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException);
        });

        it('throws a conflic exception as username already exists', async () => {

            save.mockRejectedValue({ code: '22222'}); // unknown error code
            await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('validateUserPassword', () => {

        let user;

        beforeEach(() => {

            userRepository.findOne = jest.fn();
            user = new User();
            user.username = 'testUsername';
            user.validatePassword = jest.fn();
        });
        

        it('returns the username as validationg is successful', async () => {

            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(true);
            
            const result = await userRepository.validateUserPassword(mockCredentialsDto);
            
            expect(result).toEqual(user);
        });

        it('returns null as user cannot be found', async () => {

            userRepository.findOne.mockResolvedValue(null);

            const result = await userRepository.validateUserPassword(mockCredentialsDto);

            expect(user.validatePassword).not.toHaveBeenCalled();
            expect(result).toBeNull();

        });

        it('returns null as password is invalid', async () => {

            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(false);
            
            const result = await userRepository.validateUserPassword(mockCredentialsDto);
            
            expect(user.validatePassword).toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });

    describe('hashPassword', () => {

        it('calls bcrypt.hash to generate a hash', async () => {

            bcrypt.hash = jest.fn().mockResolvedValue('testHash');
            
            expect(bcrypt.hash).not.toHaveBeenCalled();

            const result = await userRepository.hashPassword('testPassword', 'testSalt');

            expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
            expect(result).toEqual('testHash');
        });
    });
});
