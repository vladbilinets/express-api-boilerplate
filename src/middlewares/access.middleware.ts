import { NextFunction, Request, Response } from 'express';
import { Logger } from '../utils';

const winstonLogger = new Logger('Access');

const logger = (req: Request, res: Response, next: NextFunction) => {
    winstonLogger.info(
        [
            `[${(new Date()).toLocaleString()}]`,
            req.method,
            req.originalUrl,
            req.ip,
            req.headers['user-agent'],
        ].join(' '),
    );
    next();
};

export default { logger };
