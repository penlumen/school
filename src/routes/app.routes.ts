import { Router } from 'express';
import { app } from '../controllers/app.controller';

const router = Router();
router.get('/', app);

export default router;
