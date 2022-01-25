import httpStatus from 'http-status';
import BaseError from './BaseError';

class ApiUnauthorizedError extends BaseError {
    constructor(
        message: string = 'Unauthorized',
        data: object | object[] = [],
        isOperational: boolean = true,
    ) {
        super(httpStatus.UNAUTHORIZED, message, isOperational, '', data);
    }
}

export default ApiUnauthorizedError;
