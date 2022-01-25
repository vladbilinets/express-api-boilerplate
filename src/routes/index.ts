import express, { NextFunction, Request, Response } from 'express';
import authRoute from './auth.routes';
import userRoute from './user.routes';
import { Api404Error } from '../utils/errors';

const router = express.Router();
const routes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/user',
        route: userRoute,
    },
];

// Default healthcheck endpoint
router.get(
    '/healthcheck',
    (req: Request, res: Response, next: NextFunction) => res.sendStatus(200),
);

// Register all router endpoints
routes.forEach((route) => {
    router.use(route.path, route.route);
});

// Send back a 404 error for any unknown API request
router.use((req: Request, res: Response, next: NextFunction) => {
    next(new Api404Error());
});

export default router;
