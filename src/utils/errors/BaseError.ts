class BaseError extends Error {
    constructor(
        readonly statusCode: number,
        readonly message: string,
        readonly isOperational: boolean = true,
        readonly stack: string = '',
        readonly data: object | object[] = [],
    ) {
        super(message);

        if (!stack.length) {
            Error.captureStackTrace(this, this.constructor);
        }

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export default BaseError;
