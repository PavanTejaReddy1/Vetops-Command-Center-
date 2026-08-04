import { veterinarianService } from '../services/veterinarian.service.js';
import { validators } from '../validators/index.js';

export const veterinarianController = {
  async list(req, res) {
    try {
      const { search, specialization, department, status, page, limit, sortBy, sortOrder } = req.query;
      const result = await veterinarianService.list({
        search,
        specialization,
        department,
        status,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        sortBy: sortBy || 'createdAt',
        sortOrder: sortOrder || 'desc',
      });
      res.json(result);
    } catch (error) {
      console.error('List veterinarians error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch veterinarians' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const veterinarian = await veterinarianService.getById(id);
      res.json({ data: veterinarian });
    } catch (error) {
      console.error('Get veterinarian error:', error);
      if (error.message === 'Veterinarian not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message || 'Failed to fetch veterinarian' });
    }
  },

  async create(req, res) {
    try {
      const validationResult = validators.createVeterinarian.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: validationResult.error.errors 
        });
      }
      const data = validationResult.data;
      const veterinarian = await veterinarianService.create(data);
      res.status(201).json({ data: veterinarian, message: 'Veterinarian created successfully' });
    } catch (error) {
      console.error('Create veterinarian error:', error);
      res.status(400).json({ message: error.message || 'Failed to create veterinarian' });
    }
  },

  async update(req, res) {
    try {
      const validationResult = validators.updateVeterinarian.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: validationResult.error.errors 
        });
      }
      const { id } = req.params;
      const data = validationResult.data;
      const veterinarian = await veterinarianService.update(id, data);
      res.json({ data: veterinarian, message: 'Veterinarian updated successfully' });
    } catch (error) {
      console.error('Update veterinarian error:', error);
      if (error.message === 'Veterinarian not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: error.message || 'Failed to update veterinarian' });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      await veterinarianService.remove(id);
      res.json({ message: 'Veterinarian deleted successfully' });
    } catch (error) {
      console.error('Delete veterinarian error:', error);
      if (error.message === 'Veterinarian not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message || 'Failed to delete veterinarian' });
    }
  },
};
