import { Router } from 'express';
import { authController } from '../controllers';
import { validationMiddleware } from '../middlewares';
import { authSchema } from '../schema';

const router = Router();

router.post('/login', validationMiddleware(authSchema.login), authController.login);
router.post('/register', validationMiddleware(authSchema.register), authController.register);
router.post('/refresh', validationMiddleware(authSchema.refreshToken), authController.refresh);

export = router;
