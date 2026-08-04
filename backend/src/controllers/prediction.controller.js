import { predictionService } from '../services/prediction.service.js';
import { validators } from '../validators/index.js';
import { Prediction } from '../models/Prediction.model.js';

export const predictionController = {
  async list(req, res) {
    try {
      const { search, species, riskLevel, page, limit, sortBy, sortOrder } = req.query;
      const result = await predictionService.list({
        search,
        species,
        riskLevel,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        sortBy: sortBy || 'createdAt',
        sortOrder: sortOrder || 'desc',
      });
      res.json(result);
    } catch (error) {
      console.error('List predictions error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch predictions' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const prediction = await predictionService.getById(id);
      res.json({ data: prediction });
    } catch (error) {
      console.error('Get prediction error:', error);
      if (error.message === 'Prediction not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message || 'Failed to fetch prediction' });
    }
  },

  async create(req, res) {
    try {
      const validationResult = validators.createPrediction.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: validationResult.error.errors 
        });
      }
      const data = validationResult.data;
      const prediction = await predictionService.createWithAI(data);
      res.status(201).json({ data: prediction, message: 'Prediction created successfully' });
    } catch (error) {
      console.error('Create prediction error:', error);
      res.status(400).json({ message: error.message || 'Failed to create prediction' });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      await predictionService.remove(id);
      res.json({ message: 'Prediction deleted successfully' });
    } catch (error) {
      console.error('Delete prediction error:', error);
      if (error.message === 'Prediction not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message || 'Failed to delete prediction' });
    }
  },

  async getDashboardStats(req, res) {
    try {
      const [totalPredictions, highRiskCount, recentPredictions] = await Promise.all([
        Prediction.countDocuments({ isDeleted: false }),
        Prediction.countDocuments({ 'aiResult.riskLevel': { $in: ['High', 'Critical'] }, isDeleted: false }),
        Prediction.find({ isDeleted: false })
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

      res.json({
        totalPredictions,
        highRiskCount,
        recentPredictions,
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch dashboard stats' });
    }
  },
};
