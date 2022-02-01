import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync, Logger } from '../utils';
import { ApiBadRequestError } from '../utils/errors';
import { authService, tokenService } from '../services';
import { userRepository } from '../repositories';

const logger = new Logger('Auth');

const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await authService.loginWithEmailAndPassword(email, password);
    const token = await tokenService.generateAccessToken(user);
    const refreshToken = await tokenService.generateRefreshToken(user);

    logger.info(`User #${user.id} logged in`);
    return res.status(200).json({ user, token, refreshToken });
});

const register = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        await authService.registerUser(email, password);
        return res.sendStatus(httpStatus.CREATED);
    } catch (error: any) {
        throw new ApiBadRequestError(error.message || 'Unable to register user');
    }
});

const refresh = catchAsync(async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const { refreshToken } = req.body;

    if (!accessToken) {
        throw new ApiBadRequestError('Access token missing');
    }

    const payload = tokenService.verifyTokensPair(accessToken, refreshToken);
    if (!payload.valid || payload.expired || !payload.data) {
        throw new ApiBadRequestError('Invalid pair of tokens');
    }

    const user = await userRepository.getUserByEmail(payload.data.email);
    if (!user) {
        throw new ApiBadRequestError();
    }

    const newAccessToken = await tokenService.generateAccessToken(user);
    const newRefreshToken = await tokenService.generateRefreshToken(user);

    return res.status(200).json({
        user,
        token: newAccessToken,
        refreshToken: newRefreshToken,
    });
});

export default { refresh, register, login };
