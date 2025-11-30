import { Router } from 'express';
import { ResourceController } from '../controllers/resource.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { UserRole } from '../types';

const router = Router();
const controller = new ResourceController();

router.use(authenticate);

// --- Resource Templates ---

// List templates
router.get('/templates', controller.findAllTemplates);

// Create template (Admin only)
router.post('/templates', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), controller.createTemplate);

// Update template
router.put('/templates/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), controller.updateTemplate);

// Delete template
router.delete('/templates/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), controller.deleteTemplate);


// --- Site Resources ---

// Get site resources
router.get('/sites/:siteId', controller.getSiteResources);

// Update site resource (Admin, Supervisor)
router.post('/sites/:siteId', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPERVISOR), controller.updateSiteResource);

export default router;
