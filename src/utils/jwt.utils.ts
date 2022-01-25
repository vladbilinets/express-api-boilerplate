import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import Logger from './Logger.utils';
import { IUser } from '../interfaces';
import { ApiUnauthorizedError } from './errors';

const logger = new Logger('JWT');

const sign = async (user: IUser, isRefreshToken: boolean = false) => {
    const { expireTime, secret } = isRefreshToken
        ? config.server.token
        : config.server.refreshToken;
    const signTime = new Date().getTime();
    const expireTimeInSeconds = Math.floor((signTime + Number(expireTime) * 100000) / 1000);

    try {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username ?? user.email,
            },
            secret,
            {
                issuer: config.server.token.issuer,
                algorithm: 'HS256',
                expiresIn: expireTimeInSeconds,
            },
        );
    } catch (error) {
        logger.error(`Error while signing the JWT for ${user.email}`, error);
        throw new ApiUnauthorizedError('Error while signing the JWT');
    }
};

const verify = (token: string, isRefreshToken: boolean = false): {
    valid: boolean,
    expired: boolean,
    data: JwtPayload | null
} => {
    try {
        const { secret } = isRefreshToken ? config.server.token : config.server.refreshToken;
        const data = jwt.verify(token, secret);

        return {
            valid: true,
            expired: false,
            data: typeof data !== 'string' ? data : null,
        };
    } catch (error: any) {
        logger.error('JWT could not be verified', error);
        return {
            valid: false,
            expired: error.message === 'jwt expired',
            data: null,
        };
    }
};

export default { sign, verify };
