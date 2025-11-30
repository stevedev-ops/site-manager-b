import { Router } from 'express';
import { DocumentController } from '../controllers/document.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { upload } from '../middleware/upload';
import { UserRole } from '../types';

const router = Router();
const controller = new DocumentController();

router.use(authenticate);

// List documents
router.get('/', controller.findAll);

// Upload document (Admin, Supervisor)
router.post('/',
    authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPERVISOR),
    upload.single('file'),
    controller.create
);

// Get document details
router.get('/:id', controller.findById);

// Delete document
router.delete('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), controller.delete);

export default router;
