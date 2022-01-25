import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import index from '../config';
import { Logger } from '../utils';
import { BaseError } from '../utils/errors';

const logger = new Logger('ErrorMiddleware');

const handler = (err: BaseError, req: Request, res: Response, next: NextFunction) => {
    let message: string = err.message || httpStatus[httpStatus.INTERNAL_SERVER_ERROR].toString();
    let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    res.locals.errorMessage = err.message;

    if (index.env === 'production' && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR].toString();
    }

    if (index.env === 'development') {
        logger.error(err.message, err);
    }

    return res.status(statusCode).send({
        code: statusCode,
        message,
        ...(err.data && !!Object.keys(err.data).length && { data: err.data }),
        ...(index.env === 'development' && { stack: err.stack }),
    });
};

const converter = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let error = err;
    if (!(error instanceof BaseError)) {
        const statusCode = error instanceof mongoose.Error
            ? httpStatus.BAD_REQUEST
            : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new BaseError(statusCode, message.toString(), false, err.stack);
    }
    next(error);
};

export default {
    handler,
    converter,
};
