import { Router } from 'express';
import {
  getUserActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivitySummary,
} from '../controllers/activityController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/user/:userId', asyncHandler(getUserActivities));
router.get('/user/:userId/summary', asyncHandler(getActivitySummary));
router.get('/:id', asyncHandler(getActivityById));
router.post('/', asyncHandler(createActivity));
router.put('/:id', asyncHandler(updateActivity));
router.delete('/:id', asyncHandler(deleteActivity));

export default router;
