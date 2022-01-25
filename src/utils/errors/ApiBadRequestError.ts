import httpStatus from 'http-status';
import BaseError from './BaseError';

class ApiBadRequestError extends BaseError {
    constructor(
        message: string = 'Bad Request',
        data: object | object[] = [],
        isOperational: boolean = false,
    ) {
        super(httpStatus.BAD_REQUEST, message, isOperational, '', data);
    }
}

export default ApiBadRequestError;
