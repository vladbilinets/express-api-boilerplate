import httpStatus from 'http-status';
import BaseError from './BaseError';

class Api404Error extends BaseError {
    constructor(
        message: string = 'Not found',
        data: object | object[] = [],
        isOperational: boolean = false,
    ) {
        super(httpStatus.NOT_FOUND, message, isOperational, '', data);
    }
}

export default Api404Error;
