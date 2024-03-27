import { Router } from 'express';
import {
  contactUS,
  userStats,
} from '../controllers/other.controller.js';
import {  authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';

const router = Router();

// {{URL}}/api/v1/
router.route('/contact').post(contactUS);
router
  .route('/admin/stats/users')
  .get(isLoggedIn, authorizeRoles('ADMIN'), userStats);

export default router;
