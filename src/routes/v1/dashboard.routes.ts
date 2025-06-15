import { Router } from 'express';
import { cards } from '../../controllers/v1/dashboard.controller';

const router = Router();

router.get('/dashboard/cards', cards);

export default router;
