import request from 'supertest';
import app from '../../src/app';
import { tokenService } from '../../src/services';
import {
    connectTestDatabase,
    disconnectTestDatabase,
    getRandomUser,
    registerRandomUser,
} from './utils';

describe('Auth API', () => {
    beforeAll(connectTestDatabase);
    afterAll(disconnectTestDatabase);

    describe('login', () => {
        it(
            'Success - login user',
            async () => {
                const user = await registerRandomUser();
                return request(app)
                    .post('/api/auth/login')
                    .send(user)
                    .expect(200)
                    .then((response) => expect(response.body).toEqual({
                        user: expect.objectContaining({
                            id: expect.any(String),
                            email: user.email.toLowerCase(),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String),
                        }),
                        token: expect.any(String),
                        refreshToken: expect.any(String),
                    }));
            },
        );

        it(
            'Failure - login user with the wrong password',
            async () => {
                const user = await registerRandomUser();
                return request(app)
                    .post('/api/auth/login')
                    .send({
                        ...user,
                        password: 'wrongpassword',
                    })
                    .expect(401)
                    .then((response) => expect(response.body).toMatchObject({
                        code: 401,
                        message: expect.any(String),
                    }));
            },
        );
    });

    describe('register', () => {
        it(
            'Success - register user',
            () => {
                const randomUser = getRandomUser();
                return request(app)
                    .post('/api/auth/register')
                    .send({
                        ...randomUser,
                        passwordConfirmation: randomUser.password,
                    })
                    .expect(201);
            },
        );

        it(
            'Failure - register user with already used email',
            async () => {
                const user = await registerRandomUser();
                return request(app)
                    .post('/api/auth/register')
                    .send({
                        ...user,
                        passwordConfirmation: user.password,
                    })
                    .expect(400)
                    .then((response) => expect(response.body).toMatchObject({
                        code: 400,
                        message: expect.any(String),
                    }));
            },
        );

        it(
            'Failure - register user with too short password',
            async () => {
                const randomUser = await getRandomUser();
                return request(app)
                    .post('/api/auth/register')
                    .send({
                        ...randomUser,
                        password: 'pass',
                        passwordConfirmation: 'pass',
                    })
                    .expect(400)
                    .then((response) => expect(response.body).toMatchObject({
                        code: 400,
                        message: expect.any(String),
                    }));
            },
        );

        it(
            'Failure - register user without required field',
            () => request(app)
                .post('/api/auth/register')
                .send({
                    password: 'password',
                    passwordConfirmation: 'password',
                })
                .expect(400)
                .then((response) => expect(response.body).toMatchObject({
                    code: 400,
                    message: expect.any(String),
                })),
        );

        it(
            'Failure - register user with invalid password confirmation field',
            () => {
                const randomUser = getRandomUser();
                return request(app)
                    .post('/api/auth/register')
                    .send({
                        ...randomUser,
                        passwordConfirmation: 'invalidpassword',
                    })
                    .expect(400)
                    .then((response) => expect(response.body).toMatchObject({
                        code: 400,
                        message: expect.any(String),
                    }));
            },
        );
    });

    describe('refresh tokens', () => {
        it(
            'Success - refresh tokens',
            async () => {
                const user = await registerRandomUser();
                const accessToken = await tokenService.generateAccessToken(user);
                const refreshToken = await tokenService.generateRefreshToken(user);

                return request(app)
                    .post('/api/auth/refresh')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({ refreshToken })
                    .expect(200)
                    .then((response) => expect(response.body).toMatchObject({
                        token: expect.any(String),
                        refreshToken: expect.any(String),
                        user: {
                            id: expect.any(String),
                            email: user.email.toLowerCase(),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String),
                        },
                    }));
            },
        );

        it(
            'Failure - refresh tokens without access token',
            async () => {
                const user = await registerRandomUser();
                const refreshToken = await tokenService.generateRefreshToken(user);

                return request(app)
                    .post('/api/auth/refresh')
                    .send({ refreshToken })
                    .expect(400)
                    .then((response) => expect(response.body).toMatchObject({
                        code: 400,
                        message: 'Access token missing',
                    }));
            },
        );

        it(
            'Failure - refresh tokens without refresh token',
            async () => {
                const user = await registerRandomUser();
                const accessToken = await tokenService.generateAccessToken(user);

                return request(app)
                    .post('/api/auth/refresh')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .expect(400)
                    .then((response) => expect(response.body).toMatchObject({
                        code: 400,
                        message: expect.any(String),
                    }));
            },
        );

        it(
            'Failure - refresh tokens with invalid access token',
            async () => {
                const user = await registerRandomUser();
                const refreshToken = await tokenService.generateRefreshToken(user);

                return request(app)
                    .post('/api/auth/refresh')
                    .set('Authorization', 'Bearer randomtoken1234567890')
                    .send({ refreshToken })
                    .expect(400)
                    .then((response) => expect(response.body).toMatchObject({
                        code: 400,
                        message: 'Invalid pair of tokens',
                    }));
            },
        );

        it(
            'Failure - refresh tokens with invalid refresh token',
            async () => {
                const user = await registerRandomUser();
                const accessToken = await tokenService.generateAccessToken(user);

                return request(app)
                    .post('/api/auth/refresh')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({ refreshToken: 'randomtoken1234567890' })
                    .expect(400)
                    .then((response) => expect(response.body).toMatchObject({
                        code: 400,
                        message: 'Invalid pair of tokens',
                    }));
            },
        );
    });
});
