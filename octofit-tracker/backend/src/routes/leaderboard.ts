import { Router } from 'express';
import {
  getGlobalLeaderboard,
  getLeaderboardByType,
  getUserRank,
  getTeamRanking,
} from '../controllers/leaderboardController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', asyncHandler(getGlobalLeaderboard));
router.get('/type/:type', asyncHandler(getLeaderboardByType));
router.get('/user/:userId', asyncHandler(getUserRank));
router.get('/teams/ranking', asyncHandler(getTeamRanking));

export default router;
