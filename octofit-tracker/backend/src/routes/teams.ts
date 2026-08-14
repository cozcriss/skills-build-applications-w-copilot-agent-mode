import { Router } from 'express';
import {
  getAllTeams,
  getTeamById,
  createTeam,
  addMember,
  removeMember,
  getTeamLeaderboard,
  updateTeamStats,
  deleteTeam,
} from '../controllers/teamController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', asyncHandler(getAllTeams));
router.get('/:id', asyncHandler(getTeamById));
router.post('/', asyncHandler(createTeam));
router.post('/:id/members', asyncHandler(addMember));
router.delete('/:id/members', asyncHandler(removeMember));
router.get('/:id/leaderboard', asyncHandler(getTeamLeaderboard));
router.put('/:id/stats', asyncHandler(updateTeamStats));
router.delete('/:id', asyncHandler(deleteTeam));

export default router;
