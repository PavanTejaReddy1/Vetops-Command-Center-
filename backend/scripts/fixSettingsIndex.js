import 'dotenv/config';
import mongoose from 'mongoose';
import { Setting } from '../src/models/Setting.model.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

async function fix() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected');

  // Drop any stale indexes on the settings collection
  try {
    const indexes = await mongoose.connection.db.collection('settings').indexes();
    console.log('Existing indexes:', indexes.map(i => i.name));
    const stale = indexes.find(i => i.name === 'user_1');
    if (stale) {
      await mongoose.connection.db.collection('settings').dropIndex('user_1');
      console.log('Dropped stale user_1 index');
    } else {
      console.log('No stale index found');
    }
  } catch (e) {
    console.error('Index cleanup error:', e.message);
  }

  // Now seed the settings
  await Setting.deleteMany({});
  await Setting.create([
    { key: 'orgName', category: 'organization', value: 'VetOps Command Center', type: 'string', description: 'Organization name', isPublic: true },
    { key: 'supportEmail', category: 'organization', value: 'support@vetops.com', type: 'string', description: 'Support email address', isPublic: true },
    { key: 'location', category: 'organization', value: '123 Veterinary Drive, San Francisco, CA 94105', type: 'string', description: 'Primary location', isPublic: true },
    { key: 'timezone', category: 'organization', value: 'America/Los_Angeles', type: 'string', description: 'Time zone', isPublic: true },
    { key: 'theme', category: 'appearance', value: 'light', type: 'string', description: 'Theme preference', isPublic: false },
    { key: 'predictiveAlerts', category: 'notifications', value: true, type: 'boolean', description: 'Predictive bottleneck alerts', isPublic: false },
    { key: 'aiReviewReminders', category: 'notifications', value: true, type: 'boolean', description: 'AI review reminders', isPublic: false },
    { key: 'taskAssignmentUpdates', category: 'notifications', value: true, type: 'boolean', description: 'Task assignment updates', isPublic: false },
    { key: 'weeklyReportSummary', category: 'notifications', value: true, type: 'boolean', description: 'Weekly report summary', isPublic: false },
    { key: 'sessionTimeout', category: 'security', value: 60, type: 'number', description: 'Session timeout in minutes', isPublic: false },
    { key: 'requireMFA', category: 'security', value: false, type: 'boolean', description: 'Require multi-factor authentication', isPublic: false },
    { key: 'confidenceThreshold', category: 'ai', value: 0.7, type: 'number', description: 'AI prediction confidence threshold', isPublic: false },
    { key: 'autoApproveLowRisk', category: 'ai', value: false, type: 'boolean', description: 'Auto-approve low risk predictions', isPublic: false },
    { key: 'maintenanceMode', category: 'system', value: false, type: 'boolean', description: 'Maintenance mode', isPublic: false },
    { key: 'apiRateLimit', category: 'system', value: 1000, type: 'number', description: 'API rate limit per hour', isPublic: false },
  ]);
  console.log('✓ 15 settings created');
  await mongoose.disconnect();
}

fix().catch(e => { console.error(e); process.exit(1); });
