import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { ApiBadRequestError } from '../utils/errors';

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (e: any) {
        throw new ApiBadRequestError('Invalid data passed', e.errors ?? []);
    }
};

export default validate;
