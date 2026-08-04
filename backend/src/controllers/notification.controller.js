import { notificationService } from '../services/notification.service.js';

export const notificationController = {
  async list(req, res) {
    try {
      const { recipient, type, module, read, page, limit, sortBy, sortOrder } = req.query;
      const result = await notificationService.list({ recipient, type, module, read, page, limit, sortBy, sortOrder });
      res.json(result);
    } catch (error) {
      console.error('List notifications error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch notifications' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const notification = await notificationService.getById(id);
      res.json({ data: notification });
    } catch (error) {
      console.error('Get notification error:', error);
      res.status(404).json({ message: error.message || 'Notification not found' });
    }
  },

  async create(req, res) {
    try {
      const notification = await notificationService.create(req.body);
      res.status(201).json({ data: notification });
    } catch (error) {
      console.error('Create notification error:', error);
      res.status(500).json({ message: error.message || 'Failed to create notification' });
    }
  },

  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const notification = await notificationService.markAsRead(id);
      res.json({ data: notification });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(404).json({ message: error.message || 'Notification not found' });
    }
  },

  async markAllAsRead(req, res) {
    try {
      const { recipient } = req.body;
      const result = await notificationService.markAllAsRead(recipient);
      res.json({ data: result });
    } catch (error) {
      console.error('Mark all as read error:', error);
      res.status(500).json({ message: error.message || 'Failed to mark all as read' });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const notification = await notificationService.remove(id);
      res.json({ data: notification });
    } catch (error) {
      console.error('Remove notification error:', error);
      res.status(404).json({ message: error.message || 'Notification not found' });
    }
  },

  async getUnreadCount(req, res) {
    try {
      const { recipient } = req.query;
      const count = await notificationService.getUnreadCount(recipient);
      res.json({ data: { count } });
    } catch (error) {
      console.error('Get unread count error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch unread count' });
    }
  },
};
