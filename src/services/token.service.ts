import { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../interfaces';
import { jwt } from '../utils';

const generateAccessToken = async (user: IUser) => jwt.sign(user);

const generateRefreshToken = async (user: IUser) => jwt.sign(user, true);

const verifyAccessToken = (accessToken: string) => jwt.verify(accessToken);

const verifyRefreshToken = (refreshToken: string) => jwt.verify(refreshToken, true);

const verifyTokensPair = (accessToken: string, refreshToken: string): {
    valid: boolean,
    expired: boolean,
    data: JwtPayload | null,
} => {
    const accessTokenPayload = verifyAccessToken(accessToken);
    const refreshTokenPayload = verifyRefreshToken(refreshToken);

    return {
        valid:
            (accessTokenPayload.valid || accessTokenPayload.expired)
            && refreshTokenPayload.valid,
        expired: accessTokenPayload.expired && refreshTokenPayload.expired,
        data: refreshTokenPayload.data,
    };
};

export default {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    verifyTokensPair,
};
