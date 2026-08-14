#!/bin/bash

# OctoFit Tracker API Testing Script
# Tests all major endpoints on localhost:8000

API_BASE="http://localhost:8000/api"
COLORS_GREEN='\033[0;32m'
COLORS_BLUE='\033[0;34m'
COLORS_NC='\033[0m' # No Color

echo -e "${COLORS_BLUE}╔════════════════════════════════════════╗${COLORS_NC}"
echo -e "${COLORS_BLUE}║   OctoFit Tracker API Test Suite       ║${COLORS_NC}"
echo -e "${COLORS_BLUE}╚════════════════════════════════════════╝${COLORS_NC}\n"

# Test Health Check
echo -e "${COLORS_BLUE}Testing Health Check...${COLORS_NC}"
HEALTH=$(curl -s ${API_BASE}/health)
echo -e "${COLORS_GREEN}✓${COLORS_NC} ${HEALTH}\n"

# Get first user ID for testing
USERS=$(curl -s ${API_BASE}/users)
FIRST_USER_ID=$(echo "$USERS" | jq -r '.[0]._id')
FIRST_USERNAME=$(echo "$USERS" | jq -r '.[0].username')

# Test Get All Users
echo -e "${COLORS_BLUE}Testing /api/users (Get All Users)${COLORS_NC}"
USER_COUNT=$(echo "$USERS" | jq 'length')
echo -e "${COLORS_GREEN}✓${COLORS_NC} Found ${USER_COUNT} users"
echo "$USERS" | jq '.[] | {username, email, "total_activities": .stats.totalActivities, "calories_burned": .stats.caloriesBurned}' | head -20
echo ""

# Test Get User by ID
echo -e "${COLORS_BLUE}Testing /api/users/:id (Get User by ID)${COLORS_NC}"
USER_DETAIL=$(curl -s ${API_BASE}/users/${FIRST_USER_ID})
echo -e "${COLORS_GREEN}✓${COLORS_NC} User: $(echo "$USER_DETAIL" | jq -r '.username')"
echo "$USER_DETAIL" | jq '{username, email, profile, stats}'
echo ""

# Test Get User Stats
echo -e "${COLORS_BLUE}Testing /api/users/:id/stats (Get User Stats)${COLORS_NC}"
STATS=$(curl -s ${API_BASE}/users/${FIRST_USER_ID}/stats)
echo -e "${COLORS_GREEN}✓${COLORS_NC} Stats for ${FIRST_USERNAME}:"
echo "$STATS" | jq '.'
echo ""

# Test Get User Activities
echo -e "${COLORS_BLUE}Testing /api/activities/user/:userId (Get User Activities)${COLORS_NC}"
ACTIVITIES=$(curl -s ${API_BASE}/activities/user/${FIRST_USER_ID})
ACTIVITY_COUNT=$(echo "$ACTIVITIES" | jq 'length')
echo -e "${COLORS_GREEN}✓${COLORS_NC} Found ${ACTIVITY_COUNT} activities for ${FIRST_USERNAME}"
echo "$ACTIVITIES" | jq '.[] | {type, duration, caloriesBurned, intensity, date}' | head -30
echo ""

# Test Get Activity Summary
echo -e "${COLORS_BLUE}Testing /api/activities/user/:userId/summary (7-Day Summary)${COLORS_NC}"
SUMMARY=$(curl -s ${API_BASE}/activities/user/${FIRST_USER_ID}/summary)
echo -e "${COLORS_GREEN}✓${COLORS_NC} 7-Day Summary:"
echo "$SUMMARY" | jq '.'
echo ""

# Test Get Teams
echo -e "${COLORS_BLUE}Testing /api/teams (Get All Teams)${COLORS_NC}"
TEAMS=$(curl -s ${API_BASE}/teams)
TEAM_COUNT=$(echo "$TEAMS" | jq 'length')
echo -e "${COLORS_GREEN}✓${COLORS_NC} Found ${TEAM_COUNT} teams"
echo "$TEAMS" | jq '.[] | {name, "member_count": (.members | length), "total_activities": .stats.totalActivities}'
echo ""

# Test Get Global Leaderboard
echo -e "${COLORS_BLUE}Testing /api/leaderboard (Global Leaderboard)${COLORS_NC}"
LEADERBOARD=$(curl -s ${API_BASE}/leaderboard)
echo -e "${COLORS_GREEN}✓${COLORS_NC} Top 3 Users by Calories:"
echo "$LEADERBOARD" | jq '.[:3] | .[] | {username: .username, "total_calories": .stats.caloriesBurned, "total_activities": .stats.totalActivities}'
echo ""

# Test Get User Rank
echo -e "${COLORS_BLUE}Testing /api/leaderboard/user/:userId (Get User Rank)${COLORS_NC}"
USER_RANK=$(curl -s ${API_BASE}/leaderboard/user/${FIRST_USER_ID})
echo -e "${COLORS_GREEN}✓${COLORS_NC} Ranking for ${FIRST_USERNAME}:"
echo "$USER_RANK" | jq '.'
echo ""

echo -e "${COLORS_BLUE}╔════════════════════════════════════════╗${COLORS_NC}"
echo -e "${COLORS_GREEN}✓ All API tests completed successfully! ${COLORS_NC}"
echo -e "${COLORS_BLUE}╚════════════════════════════════════════╝${COLORS_NC}\n"
