import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { IUser } from '../../src/interfaces';
import app from '../../src/app';

const connectTestDatabase = async (): Promise<void> => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
};

const disconnectTestDatabase = async (): Promise<void> => {
    await mongoose.disconnect();
    await mongoose.connection.close();
};

const getRandomString = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    return Array(length)
        .fill('')
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join('');
};

const getRandomUser = (): IUser => <IUser>({
    email: `${getRandomString(16)}@test.com`,
    password: getRandomString(16),
});

const registerRandomUser = async (): Promise<IUser> => {
    const randomUser = getRandomUser();
    await request(app)
        .post('/api/auth/register')
        .send({
            ...randomUser,
            passwordConfirmation: randomUser.password,
        });
    return randomUser;
};

export {
    connectTestDatabase,
    disconnectTestDatabase,
    getRandomUser,
    getRandomString,
    registerRandomUser,
};
