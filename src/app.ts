import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import mongoSanitize from 'express-mongo-sanitize';
import routes from './routes';
import { accessMiddleware, authMiddleware, errorMiddleware } from './middlewares';

const app = express();

// Set security HTTP headers
app.use(helmet());

// Parse the body of the request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sanitize request data
app.use(mongoSanitize());

// Enable CORS
app.use(cors());

// Log every request to the server
app.use(accessMiddleware.logger);

// Deserialize user from JWT
app.use(authMiddleware.deserializeUser);

// API routes
app.use('/api', routes);

// Convert Error to BaseError if needed
app.use(errorMiddleware.converter);

// Handle errors
app.use(errorMiddleware.handler);

export default app;
