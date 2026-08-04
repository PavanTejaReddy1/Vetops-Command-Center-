import { settingService } from '../services/setting.service.js';

/**
 * Settings controller — PHASE 2.
 * Handlers are stubbed to return 501 Not Implemented so the API surface
 * (routes + shape) is real and testable even before business logic lands.
 */
export const settingController = {
  async list(req, res) {
    res.status(501).json({ message: 'Settings: list endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async getById(req, res) {
    res.status(501).json({ message: 'Settings: getById endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async create(req, res) {
    res.status(501).json({ message: 'Settings: create endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async update(req, res) {
    res.status(501).json({ message: 'Settings: update endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async remove(req, res) {
    res.status(501).json({ message: 'Settings: remove endpoint not implemented yet (Phase 1 scaffold).' });
  },
};
