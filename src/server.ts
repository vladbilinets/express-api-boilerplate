import http from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { Logger } from './utils';

const logger = new Logger('Server');

// Connect to Mongo
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then(() => {
        logger.info('Connected to MongoDB!');
    })
    .catch((error) => {
        logger.error(error.message, error);
    });

// Create HTTP server
const httpServer = http.createServer(app);
httpServer.listen(
    config.server.port,
    () => logger.info(`Server is running ${config.server.hostname}:${config.server.port}`),
);

// Handle unexpected server errors
const unexpectedErrorHandler = (error: Error) => {
    logger.error('Unexpected server error', error);

    if (httpServer) {
        httpServer.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
