import { forecastService } from '../services/forecast.service.js';

/**
 * Forecast & Capacity controller — PHASE 2.
 * Handlers are stubbed to return 501 Not Implemented so the API surface
 * (routes + shape) is real and testable even before business logic lands.
 */
export const forecastController = {
  async list(req, res) {
    res.status(501).json({ message: 'Forecast & Capacity: list endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async getById(req, res) {
    res.status(501).json({ message: 'Forecast & Capacity: getById endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async create(req, res) {
    res.status(501).json({ message: 'Forecast & Capacity: create endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async update(req, res) {
    res.status(501).json({ message: 'Forecast & Capacity: update endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async remove(req, res) {
    res.status(501).json({ message: 'Forecast & Capacity: remove endpoint not implemented yet (Phase 1 scaffold).' });
  },
};
