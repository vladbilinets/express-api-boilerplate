import { Router } from 'express';
import { authMiddleware } from '../middlewares';
import { userController } from '../controllers';

const router = Router();

router.get('/', authMiddleware.requireUser, userController.getUser);

export = router;
