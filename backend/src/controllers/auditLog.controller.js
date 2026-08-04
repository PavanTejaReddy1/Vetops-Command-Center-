import { auditLogService } from '../services/auditLog.service.js';

/**
 * Audit Logs controller — PHASE 2.
 * Handlers are stubbed to return 501 Not Implemented so the API surface
 * (routes + shape) is real and testable even before business logic lands.
 */
export const auditLogController = {
  async list(req, res) {
    res.status(501).json({ message: 'Audit Logs: list endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async getById(req, res) {
    res.status(501).json({ message: 'Audit Logs: getById endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async create(req, res) {
    res.status(501).json({ message: 'Audit Logs: create endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async update(req, res) {
    res.status(501).json({ message: 'Audit Logs: update endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async remove(req, res) {
    res.status(501).json({ message: 'Audit Logs: remove endpoint not implemented yet (Phase 1 scaffold).' });
  },
};
