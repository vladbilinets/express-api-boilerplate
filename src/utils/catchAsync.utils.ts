import { Request, Response, NextFunction } from 'express';

const catchAsyncUtils = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise
        .resolve(fn(req, res, next))
        .catch((err: Error) => next(err));
};

export default catchAsyncUtils;
