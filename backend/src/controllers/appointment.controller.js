import { appointmentService } from '../services/appointment.service.js';

/**
 * Workflow Queue / Appointments controller — PHASE 2.
 * Handlers are stubbed to return 501 Not Implemented so the API surface
 * (routes + shape) is real and testable even before business logic lands.
 */
export const appointmentController = {
  async list(req, res) {
    res.status(501).json({ message: 'Workflow Queue / Appointments: list endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async getById(req, res) {
    res.status(501).json({ message: 'Workflow Queue / Appointments: getById endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async create(req, res) {
    res.status(501).json({ message: 'Workflow Queue / Appointments: create endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async update(req, res) {
    res.status(501).json({ message: 'Workflow Queue / Appointments: update endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async remove(req, res) {
    res.status(501).json({ message: 'Workflow Queue / Appointments: remove endpoint not implemented yet (Phase 1 scaffold).' });
  },
};
