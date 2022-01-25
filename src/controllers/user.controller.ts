import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils';

const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => (
    res.status(200).json({ user: res.locals.user })
));

export default {
    getUser,
};
