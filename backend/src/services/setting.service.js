import { Setting } from '../models/Setting.model.js';

const DEFAULT_SETTINGS = {
  organization: {
    orgName: { value: 'VetOps Command Center', type: 'string', description: 'Organization name' },
    supportEmail: { value: 'support@vetops.com', type: 'string', description: 'Support email address' },
    location: { value: '', type: 'string', description: 'Primary location' },
    timezone: { value: 'America/Los_Angeles', type: 'string', description: 'Time zone' },
  },
  appearance: {
    theme: { value: 'light', type: 'string', description: 'Theme preference' },
  },
  notifications: {
    predictiveAlerts: { value: true, type: 'boolean', description: 'Predictive bottleneck alerts' },
    aiReviewReminders: { value: true, type: 'boolean', description: 'AI review reminders' },
    taskAssignmentUpdates: { value: true, type: 'boolean', description: 'Task assignment updates' },
    weeklyReportSummary: { value: true, type: 'boolean', description: 'Weekly report summary' },
  },
  security: {
    sessionTimeout: { value: 60, type: 'number', description: 'Session timeout in minutes' },
    requireMFA: { value: false, type: 'boolean', description: 'Require multi-factor authentication' },
  },
  ai: {
    confidenceThreshold: { value: 0.7, type: 'number', description: 'AI prediction confidence threshold' },
    autoApproveLowRisk: { value: false, type: 'boolean', description: 'Auto-approve low risk predictions' },
  },
  system: {
    maintenanceMode: { value: false, type: 'boolean', description: 'Maintenance mode' },
    apiRateLimit: { value: 1000, type: 'number', description: 'API rate limit per hour' },
  },
};

export const settingService = {
  async initializeDefaults() {
    for (const [category, settings] of Object.entries(DEFAULT_SETTINGS)) {
      for (const [key, config] of Object.entries(settings)) {
        const existing = await Setting.findOne({ key });
        if (!existing) {
          await Setting.create({
            key,
            category,
            value: config.value,
            type: config.type,
            description: config.description,
          });
        }
      }
    }
  },

  async getByCategory(category) {
    const settings = await Setting.find({ category });
    const result = {};
    settings.forEach((setting) => {
      result[setting.key] = setting.value;
    });
    return result;
  },

  async getAll() {
    const settings = await Setting.find();
    const result = {};
    settings.forEach((setting) => {
      if (!result[setting.category]) {
        result[setting.category] = {};
      }
      result[setting.category][setting.key] = setting.value;
    });
    return result;
  },

  async update(key, value) {
    const setting = await Setting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: false }
    );
    if (!setting) {
      throw new Error('Setting not found');
    }
    return setting;
  },

  async updateCategory(category, updates) {
    const operations = Object.entries(updates).map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: { value },
      },
    }));
    
    const result = await Setting.bulkWrite(operations);
    return result;
  },

  async resetToDefaults(category) {
    if (category && DEFAULT_SETTINGS[category]) {
      for (const [key, config] of Object.entries(DEFAULT_SETTINGS[category])) {
        await Setting.findOneAndUpdate(
          { key },
          { value: config.value },
          { upsert: true }
        );
      }
    } else {
      await this.initializeDefaults();
    }
  },
};
