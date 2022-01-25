import { Request, Response, NextFunction } from 'express';
import { ApiUnauthorizedError } from '../utils/errors';
import { tokenService } from '../services';

const deserializeUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return next();
    }

    const payload = tokenService.verifyAccessToken(token);
    if (payload.valid) {
        res.locals.user = payload.data;
    }

    return next();
};

const requireUser = (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.user) {
        throw new ApiUnauthorizedError();
    }

    next();
};

export default {
    deserializeUser,
    requireUser,
};
