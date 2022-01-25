import httpStatus from 'http-status';
import BaseError from './BaseError';

class ApiInternalError extends BaseError {
    constructor(
        message: string = 'Internal server error',
        data: object | object[] = [],
        isOperational: boolean = false,
    ) {
        super(httpStatus.INTERNAL_SERVER_ERROR, message, isOperational, '', data);
    }
}

export default ApiInternalError;
