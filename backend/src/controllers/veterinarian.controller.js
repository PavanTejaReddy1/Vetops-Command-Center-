import { veterinarianService } from '../services/veterinarian.service.js';

/**
 * Veterinarians controller — PHASE 2.
 * Handlers are stubbed to return 501 Not Implemented so the API surface
 * (routes + shape) is real and testable even before business logic lands.
 */
export const veterinarianController = {
  async list(req, res) {
    res.status(501).json({ message: 'Veterinarians: list endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async getById(req, res) {
    res.status(501).json({ message: 'Veterinarians: getById endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async create(req, res) {
    res.status(501).json({ message: 'Veterinarians: create endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async update(req, res) {
    res.status(501).json({ message: 'Veterinarians: update endpoint not implemented yet (Phase 1 scaffold).' });
  },
  async remove(req, res) {
    res.status(501).json({ message: 'Veterinarians: remove endpoint not implemented yet (Phase 1 scaffold).' });
  },
};
