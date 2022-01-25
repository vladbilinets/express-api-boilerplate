import { object, string } from 'zod';

const loginBody = {
    email: string({
        required_error: 'email is required',
    }).email('Not a valid email'),
    password: string({
        required_error: 'password is required',
    }).min(8, 'Password too short - should be at least 8 characters.')
};

const login = object({
    body: object(loginBody),
});

const register = object({
    body: object({
        ...loginBody,
        passwordConfirmation: string({
            required_error: 'passwordConfirmation is required',
        }),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: 'Passwords do not match',
        path: ['passwordConfirmation'],
    }),
});

const refreshToken = object({
    body: object({
        refreshToken: string({
            required_error: 'refreshToken is required',
        }),
    }),
});

export default {
    login,
    register,
    refreshToken,
};
