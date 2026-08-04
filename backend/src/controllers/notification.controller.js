import { notificationService } from '../services/notification.service.js';

/**
 * Notifications controller — PHASE 2.
 * Handlers are stubbed to return 501 Not Implemented so the API surface
 * (routes + shape) is real and testable even before business logic lands.
 */
export const notificationController = {
  async list(req, res) {
    res.status(501).json({ message: 'Notifications: list endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async getById(req, res) {
    res.status(501).json({ message: 'Notifications: getById endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async create(req, res) {
    res.status(501).json({ message: 'Notifications: create endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async update(req, res) {
    res.status(501).json({ message: 'Notifications: update endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async remove(req, res) {
    res.status(501).json({ message: 'Notifications: remove endpoint not implemented yet (Phase 1 scaffold).' });
  },
};
