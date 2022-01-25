import winston from 'winston';
import config from '../config';

export const winstonLogger = winston.createLogger({
    level: config.env === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.splat(),
        winston.format.printf(({ level, message }) => `${level}: ${message}`),
    ),
    transports: [
        new winston.transports.Console({
            stderrLevels: ['error'],
            silent: process.env.NODE_ENV === 'test',
        }),
    ],
});

class Logger {
    constructor(readonly namespace: string) {}

    public info(message: string, meta: any = null) {
        return winstonLogger.info(this.formatMessage(message, meta));
    }

    public warn(message: string, meta: any = null) {
        return winstonLogger.warn(this.formatMessage(message, meta));
    }

    public error(message: string, meta: any = null) {
        return winstonLogger.error(this.formatMessage(message, meta));
    }

    public debug(message: string, meta: any = null) {
        return winstonLogger.debug(this.formatMessage(message, meta));
    }

    private formatMessage(message: string, meta: any): string {
        const formattedMessage = `[${this.namespace}] ${message}`;

        switch (typeof meta) {
            case 'object': {
                try {
                    if (meta === null || !Object.keys(meta).length) {
                        return formattedMessage;
                    }

                    // return error stack if it is an instance of error
                    if (meta instanceof Error && meta.stack) {
                        return `${formattedMessage} \r\n${meta.stack}`;
                    }

                    const jsonMeta = JSON.stringify(meta, null, '\t');
                    return `${formattedMessage} \r\n${jsonMeta}`;
                } catch (error: any) {
                    return formattedMessage;
                }
            }
            case 'string': return `${formattedMessage} (${meta})`;
            default: return formattedMessage;
        }
    }
}

export default Logger;
