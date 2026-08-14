import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Activity } from '../models/Activity.js';
import { Team } from '../models/Team.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Activity.deleteMany({});
    await Team.deleteMany({});

    // Create users
    console.log('Creating users...');
    const users = await User.insertMany([
      {
        username: 'alex_runner',
        email: 'alex@example.com',
        password: 'hashed_password_1',
        profile: {
          firstName: 'Alex',
          lastName: 'Johnson',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
          bio: 'Marathon enthusiast and fitness lover',
        },
        stats: {
          totalActivities: 0,
          totalDuration: 0,
          caloriesBurned: 0,
        },
      },
      {
        username: 'sarah_cyclist',
        email: 'sarah@example.com',
        password: 'hashed_password_2',
        profile: {
          firstName: 'Sarah',
          lastName: 'Chen',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          bio: 'Cycling enthusiast and trainer',
        },
        stats: {
          totalActivities: 0,
          totalDuration: 0,
          caloriesBurned: 0,
        },
      },
      {
        username: 'mike_swimmer',
        email: 'mike@example.com',
        password: 'hashed_password_3',
        profile: {
          firstName: 'Mike',
          lastName: 'Rodriguez',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
          bio: 'Competitive swimmer and fitness coach',
        },
        stats: {
          totalActivities: 0,
          totalDuration: 0,
          caloriesBurned: 0,
        },
      },
      {
        username: 'emma_gym',
        email: 'emma@example.com',
        password: 'hashed_password_4',
        profile: {
          firstName: 'Emma',
          lastName: 'Williams',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
          bio: 'Strength training and fitness journey',
        },
        stats: {
          totalActivities: 0,
          totalDuration: 0,
          caloriesBurned: 0,
        },
      },
      {
        username: 'john_walker',
        email: 'john@example.com',
        password: 'hashed_password_5',
        profile: {
          firstName: 'John',
          lastName: 'Brown',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
          bio: 'Daily walker and fitness enthusiast',
        },
        stats: {
          totalActivities: 0,
          totalDuration: 0,
          caloriesBurned: 0,
        },
      },
      {
        username: 'lisa_crossfit',
        email: 'lisa@example.com',
        password: 'hashed_password_6',
        profile: {
          firstName: 'Lisa',
          lastName: 'Martinez',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
          bio: 'CrossFit champion and mentor',
        },
        stats: {
          totalActivities: 0,
          totalDuration: 0,
          caloriesBurned: 0,
        },
      },
    ]);

    console.log(`Created ${users.length} users`);

    // Create teams
    console.log('Creating teams...');
    const teams = await Team.insertMany([
      {
        name: 'Runners Elite',
        description: 'A team of passionate runners pushing their limits',
        leader: users[0]._id,
        members: [users[0]._id, users[1]._id, users[4]._id],
        stats: {
          totalActivities: 0,
          totalDuration: 0,
          totalCalories: 0,
        },
      },
      {
        name: 'Aquatic Warriors',
        description: 'Swimming and water sports enthusiasts',
        leader: users[2]._id,
        members: [users[2]._id, users[5]._id],
        stats: {
          totalActivities: 0,
          totalDuration: 0,
          totalCalories: 0,
        },
      },
      {
        name: 'Gym Legends',
        description: 'Strength training and bodybuilding community',
        leader: users[3]._id,
        members: [users[3]._id, users[5]._id, users[1]._id],
        stats: {
          totalActivities: 0,
          totalDuration: 0,
          totalCalories: 0,
        },
      },
    ]);

    console.log(`Created ${teams.length} teams`);

    // Update users with team references
    await User.findByIdAndUpdate(users[0]._id, { team: teams[0]._id });
    await User.findByIdAndUpdate(users[1]._id, { team: teams[0]._id });
    await User.findByIdAndUpdate(users[2]._id, { team: teams[1]._id });
    await User.findByIdAndUpdate(users[3]._id, { team: teams[2]._id });
    await User.findByIdAndUpdate(users[4]._id, { team: teams[0]._id });
    await User.findByIdAndUpdate(users[5]._id, { team: teams[1]._id });

    // Create activities for each user
    console.log('Creating activities...');
    const activityTypes = ['running', 'cycling', 'swimming', 'gym', 'walking'];
    const intensityLevels = ['low', 'medium', 'high'];
    let totalActivitiesCreated = 0;

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const numActivities = Math.floor(Math.random() * 8) + 5; // 5-12 activities per user

      for (let j = 0; j < numActivities; j++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const activityDate = new Date();
        activityDate.setDate(activityDate.getDate() - daysAgo);

        const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        const duration = Math.floor(Math.random() * 120) + 20; // 20-140 minutes
        const intensity = intensityLevels[Math.floor(Math.random() * intensityLevels.length)];
        const caloriesBurned = Math.floor(Math.random() * 600) + 200; // 200-800 calories

        const activity = new Activity({
          userId: user._id,
          type,
          duration,
          distance: ['running', 'cycling', 'walking'].includes(type) ? Math.random() * 15 + 2 : undefined,
          caloriesBurned,
          intensity,
          notes: `Great ${type} session today!`,
          date: activityDate,
        });

        await activity.save();

        // Update user stats
        user.stats.totalActivities += 1;
        user.stats.totalDuration += duration;
        user.stats.caloriesBurned += caloriesBurned;

        totalActivitiesCreated++;
      }

      await user.save();
    }

    console.log(`Created ${totalActivitiesCreated} activities`);

    // Update team stats
    console.log('Updating team statistics...');
    for (const team of teams) {
      const activities = await Activity.find({ userId: { $in: team.members } });
      team.stats.totalActivities = activities.length;
      team.stats.totalDuration = activities.reduce((sum, a) => sum + a.duration, 0);
      team.stats.totalCalories = activities.reduce((sum, a) => sum + a.caloriesBurned, 0);
      await team.save();
    }

    // Display summary
    console.log('\n=== DATABASE SEEDING COMPLETE ===');
    console.log(`✓ Created ${users.length} users`);
    console.log(`✓ Created ${teams.length} teams`);
    console.log(`✓ Created ${totalActivitiesCreated} activities`);
    console.log('\n=== SAMPLE USERS ===');
    users.forEach((user) => {
      console.log(`  • ${user.username} (${user.email}) - ${user.stats.totalActivities} activities, ${user.stats.caloriesBurned} calories`);
    });

    console.log('\n=== SAMPLE TEAMS ===');
    teams.forEach((team) => {
      console.log(`  • ${team.name} - ${team.members.length} members, ${team.stats.totalActivities} activities`);
    });

    await mongoose.disconnect();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
