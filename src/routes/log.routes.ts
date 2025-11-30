import { Router } from 'express';
import { createLog } from '../controllers/log.controller';

const router = Router();

// Allow clients to POST logs
router.post('/', createLog);

export default router;
