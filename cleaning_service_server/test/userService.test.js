const UserService = require('../services/UserService');
const UserRepository = require('../repositories/UserRepository');
const OrderRepository = require('../repositories/OrderRepository');
const ReviewRepository = require('../repositories/ReviewRepository');
const OrderRatingRepository = require('../repositories/OrderRatingRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../repositories/UserRepository');
jest.mock('../repositories/OrderRepository');
jest.mock('../repositories/ReviewRepository');
jest.mock('../repositories/OrderRatingRepository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('UserService', () => {
    describe('register', () => {
        it('should register a new user successfully', async () => {
            const userData = { email: 'test@example.com', password: 'password123' };
            const hashedPassword = 'hashedPassword';

            UserRepository.findUserByEmail.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue(hashedPassword);
            UserRepository.create.mockResolvedValue({ ...userData, password: hashedPassword });

            const result = await UserService.register(userData);
            expect(result).toEqual({ ...userData, password: hashedPassword });
            expect(UserRepository.findUserByEmail).toHaveBeenCalledWith(userData.email);
            expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
            expect(UserRepository.create).toHaveBeenCalledWith({ ...userData, password: hashedPassword });
        });

        it('should throw an error if email is already registered', async () => {
            const userData = { email: 'test@example.com', password: 'password123' };
            UserRepository.findUserByEmail.mockResolvedValue({});

            await expect(UserService.register(userData)).rejects.toThrow('Email уже зарегистрирован');
        });
    });

    describe('login', () => {
        it('should login a user successfully', async () => {
            const email = 'test@example.com';
            const password = 'password123';
            const user = {
                id: 1,
                email,
                username: 'tester',
                password: 'hashedPassword',
                role: 'user',
                toJSON: () => ({ id: 1, email, username: 'tester', password: 'hashedPassword', role: 'user' }),
            };

            UserRepository.findUserByEmailWithPassword.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            const token = 'jwt.token';
            jwt.sign.mockReturnValue(token);

            const result = await UserService.login(email, password);
            expect(result).toEqual({
                user: { id: user.id, email: user.email, username: 'tester', role: user.role },
                token,
            });
            expect(UserRepository.findUserByEmailWithPassword).toHaveBeenCalledWith(email);
            expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
            expect(jwt.sign).toHaveBeenCalledWith({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        });

        it('should throw an error if email or password is invalid', async () => {
            const email = 'test@example.com';
            const password = 'wrongPassword';
            UserRepository.findUserByEmailWithPassword.mockResolvedValue(null);

            await expect(UserService.login(email, password)).rejects.toThrow('Invalid email or password');

            UserRepository.findUserByEmailWithPassword.mockResolvedValue({ id: 1, email, password: 'hashedPassword' });
            bcrypt.compare.mockResolvedValue(false);

            await expect(UserService.login(email, password)).rejects.toThrow('Invalid email or password');
        });
    });

    describe('getProfile', () => {
        it('should return public user fields', async () => {
            const user = {
                id: 2,
                username: 'u',
                email: 'u@example.com',
                role: 'user',
                toJSON: () => ({ id: 2, username: 'u', email: 'u@example.com', role: 'user' }),
            };
            UserRepository.findById.mockResolvedValue(user);

            const result = await UserService.getProfile(2);
            expect(result).toEqual({ id: 2, username: 'u', email: 'u@example.com', role: 'user' });
        });

        it('should throw if user not found', async () => {
            UserRepository.findById.mockResolvedValue(null);
            await expect(UserService.getProfile(99)).rejects.toThrow('User not found');
        });
    });

    describe('updateProfile', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should update username', async () => {
            const dbUser = {
                id: 1,
                username: 'old',
                email: 'a@b.com',
                password: 'hash',
                role: 'user',
                toJSON: () => ({ id: 1, username: 'old', email: 'a@b.com', role: 'user' }),
            };
            const updated = {
                id: 1,
                username: 'newname',
                email: 'a@b.com',
                role: 'user',
                toJSON: () => ({ id: 1, username: 'newname', email: 'a@b.com', role: 'user' }),
            };
            UserRepository.findByIdWithPassword.mockResolvedValue(dbUser);
            UserRepository.update.mockResolvedValue(updated);

            const result = await UserService.updateProfile(1, { username: 'newname' });
            expect(result).toEqual({ id: 1, username: 'newname', email: 'a@b.com', role: 'user' });
            expect(UserRepository.update).toHaveBeenCalledWith(1, { username: 'newname' });
        });

        it('should return current profile when no changes', async () => {
            const dbUser = {
                id: 1,
                username: 'u',
                email: 'a@b.com',
                password: 'h',
                role: 'user',
                toJSON: () => ({ id: 1, username: 'u', email: 'a@b.com', role: 'user' }),
            };
            UserRepository.findByIdWithPassword.mockResolvedValue(dbUser);

            const result = await UserService.updateProfile(1, {});
            expect(result).toEqual({ id: 1, username: 'u', email: 'a@b.com', role: 'user' });
            expect(UserRepository.update).not.toHaveBeenCalled();
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const users = [{ id: 1, email: 'test@example.com' }];
            UserRepository.findAll.mockResolvedValue(users);

            const result = await UserService.getAllUsers();
            expect(result).toEqual(users);
        });
    });

    describe('getUserById', () => {
        it('should return a user by ID', async () => {
            const userId = 1;
            const user = { id: userId, email: 'test@example.com' };
            UserRepository.findById.mockResolvedValue(user);

            const result = await UserService.getUserById(userId);
            expect(result).toEqual(user);
        });

        it('should throw an error if user not found', async () => {
            const userId = 1;
            UserRepository.findById.mockResolvedValue(null);

            await expect(UserService.getUserById(userId)).rejects.toThrow('User not found');
        });
    });

    describe('updateUser', () => {
        it('should update a user successfully', async () => {
            const userId = 1;
            const userData = { email: 'updated@example.com' };
            UserRepository.update.mockResolvedValue(userData);

            const result = await UserService.updateUser(userId, userData);
            expect(result).toEqual(userData);
            expect(UserRepository.update).toHaveBeenCalledWith(userId, userData);
        });
    });

    describe('deleteUser', () => {
        beforeEach(() => {
            jest.clearAllMocks(); 
        });

        it('should delete a user successfully', async () => {
            const userId = 1;

            const orders = [{ id: 1 }, { id: 2 }];
            const ratings = [{ id: 1 }, { id: 2 }];

            OrderRepository.findAllByUserId.mockResolvedValue(orders);
            OrderRatingRepository.findAllByOrderId.mockResolvedValue(ratings);
            OrderRatingRepository.deleteAllByOrderId.mockResolvedValue();
            OrderRepository.deleteAllByUserId.mockResolvedValue();
            ReviewRepository.findAllByUserId.mockResolvedValue([{ id: 3 }]);
            ReviewRepository.deleteAllByUserId.mockResolvedValue();
            UserRepository.delete.mockResolvedValue(undefined);

            const result = await UserService.deleteUser(userId);

            // Expectations
            expect(result).toEqual(undefined);
            expect(OrderRepository.findAllByUserId).toHaveBeenCalledWith(userId);
            expect(OrderRatingRepository.findAllByOrderId).toHaveBeenCalledTimes(2);
            expect(OrderRatingRepository.deleteAllByOrderId).toHaveBeenCalledWith(1);
            expect(OrderRatingRepository.deleteAllByOrderId).toHaveBeenCalledWith(2);
            expect(OrderRepository.deleteAllByUserId).toHaveBeenCalledWith(userId);
            expect(ReviewRepository.findAllByUserId).toHaveBeenCalledWith(userId);
            expect(ReviewRepository.deleteAllByUserId).toHaveBeenCalledWith(userId);
            expect(UserRepository.delete).toHaveBeenCalledWith(userId);
        });

        it('should throw an error if user deletion fails', async () => {
            const userId = 1;
            const orders = [{ id: 1 }, { id: 2 }];
            const ratings = [{ id: 1 }, { id: 2 }];

            OrderRepository.findAllByUserId.mockResolvedValue(orders);
            OrderRatingRepository.findAllByOrderId.mockResolvedValue(ratings);
            OrderRatingRepository.deleteAllByOrderId.mockResolvedValue();
            OrderRepository.deleteAllByUserId.mockResolvedValue();
            ReviewRepository.findAllByUserId.mockResolvedValue([{ id: 3 }]);
            ReviewRepository.deleteAllByUserId.mockResolvedValue();
            UserRepository.delete.mockRejectedValue(new Error('Deletion error'));

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            await expect(UserService.deleteUser(userId)).rejects.toThrow('Ошибка при удалении пользователя: Deletion error');

            expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting user:', expect.any(Error));

            consoleErrorSpy.mockRestore();
        });
    });
});