import { settingService } from '../services/setting.service.js';

export const settingController = {
  async getAll(req, res) {
    try {
      const settings = await settingService.getAll();
      res.json({ data: settings });
    } catch (error) {
      console.error('Get all settings error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch settings' });
    }
  },

  async getByCategory(req, res) {
    try {
      const { category } = req.params;
      const settings = await settingService.getByCategory(category);
      res.json({ data: settings });
    } catch (error) {
      console.error('Get settings by category error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch settings' });
    }
  },

  async update(req, res) {
    try {
      const { key } = req.params;
      const { value } = req.body;
      const setting = await settingService.update(key, value);
      res.json({ data: setting });
    } catch (error) {
      console.error('Update setting error:', error);
      res.status(500).json({ message: error.message || 'Failed to update setting' });
    }
  },

  async updateCategory(req, res) {
    try {
      const { category } = req.params;
      const updates = req.body;
      const result = await settingService.updateCategory(category, updates);
      res.json({ data: result });
    } catch (error) {
      console.error('Update category settings error:', error);
      res.status(500).json({ message: error.message || 'Failed to update settings' });
    }
  },

  async reset(req, res) {
    try {
      const { category } = req.params;
      await settingService.resetToDefaults(category);
      res.json({ message: 'Settings reset to defaults' });
    } catch (error) {
      console.error('Reset settings error:', error);
      res.status(500).json({ message: error.message || 'Failed to reset settings' });
    }
  },
};
