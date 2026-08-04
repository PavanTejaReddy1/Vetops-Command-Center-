import { userService } from '../services/user.service.js';

/**
 * Users controller — PHASE 2.
 * Handlers are stubbed to return 501 Not Implemented so the API surface
 * (routes + shape) is real and testable even before business logic lands.
 */
export const userController = {
  async list(req, res) {
    res.status(501).json({ message: 'Users: list endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async getById(req, res) {
    res.status(501).json({ message: 'Users: getById endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async create(req, res) {
    res.status(501).json({ message: 'Users: create endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async update(req, res) {
    res.status(501).json({ message: 'Users: update endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async remove(req, res) {
    res.status(501).json({ message: 'Users: remove endpoint not implemented yet (Phase 1 scaffold).' });
  },
};
