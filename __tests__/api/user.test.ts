import request from 'supertest';
import app from '../../src/app';
import { tokenService } from '../../src/services';
import { connectTestDatabase, disconnectTestDatabase, registerRandomUser } from './utils';

describe('User API', () => {
    beforeAll(connectTestDatabase);
    afterAll(disconnectTestDatabase);

    describe('GET', () => {
        it(
            'Success - get user',
            async () => {
                const user = await registerRandomUser();
                const accessToken = await tokenService.generateAccessToken(user);

                return request(app)
                    .get('/api/user')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .expect(200)
                    .then((response) => expect(response.body).toMatchObject({
                        user: {
                            email: user.email,
                        },
                    }));
            },
        );

        it(
            'Failure - get user without access token',
            () => request(app)
                .get('/api/user')
                .expect(401)
                .then((response) => expect(response.body).toMatchObject({
                    code: 401,
                    message: expect.any(String),
                })),
        );
    });
});
