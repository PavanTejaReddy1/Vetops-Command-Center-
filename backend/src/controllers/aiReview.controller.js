import { aiReviewService } from '../services/aiReview.service.js';

export const aiReviewController = {
  async list(req, res) {
    try {
      const { status, severity, module, page, limit, sortBy, sortOrder } = req.query;
      const result = await aiReviewService.list({
        status,
        severity,
        module,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        sortBy: sortBy || 'createdAt',
        sortOrder: sortOrder || 'desc',
      });
      res.json(result);
    } catch (error) {
      console.error('List AI reviews error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch AI reviews' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const review = await aiReviewService.getById(id);
      res.json({ data: review });
    } catch (error) {
      console.error('Get AI review error:', error);
      if (error.message === 'AI Review not found') return res.status(404).json({ message: error.message });
      res.status(500).json({ message: error.message || 'Failed to fetch AI review' });
    }
  },

  async create(req, res) {
    try {
      const review = await aiReviewService.create(req.body);
      res.status(201).json({ data: review, message: 'AI Review created successfully' });
    } catch (error) {
      console.error('Create AI review error:', error);
      res.status(400).json({ message: error.message || 'Failed to create AI review' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const review = await aiReviewService.update(id, req.body);
      res.json({ data: review, message: 'AI Review updated successfully' });
    } catch (error) {
      console.error('Update AI review error:', error);
      if (error.message === 'AI Review not found') return res.status(404).json({ message: error.message });
      res.status(400).json({ message: error.message || 'Failed to update AI review' });
    }
  },

  async approve(req, res) {
    try {
      const { id } = req.params;
      const { note } = req.body;
      const review = await aiReviewService.approve(id, req.user?.id, note);
      res.json({ data: review, message: 'AI Review approved' });
    } catch (error) {
      console.error('Approve AI review error:', error);
      if (error.message === 'AI Review not found') return res.status(404).json({ message: error.message });
      res.status(400).json({ message: error.message || 'Failed to approve AI review' });
    }
  },

  async reject(req, res) {
    try {
      const { id } = req.params;
      const { note } = req.body;
      const review = await aiReviewService.reject(id, req.user?.id, note);
      res.json({ data: review, message: 'AI Review rejected' });
    } catch (error) {
      console.error('Reject AI review error:', error);
      if (error.message === 'AI Review not found') return res.status(404).json({ message: error.message });
      res.status(400).json({ message: error.message || 'Failed to reject AI review' });
    }
  },

  async dismiss(req, res) {
    try {
      const { id } = req.params;
      const { note } = req.body;
      const review = await aiReviewService.dismiss(id, req.user?.id, note);
      res.json({ data: review, message: 'AI Review dismissed' });
    } catch (error) {
      console.error('Dismiss AI review error:', error);
      if (error.message === 'AI Review not found') return res.status(404).json({ message: error.message });
      res.status(400).json({ message: error.message || 'Failed to dismiss AI review' });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      await aiReviewService.remove(id);
      res.json({ message: 'AI Review deleted successfully' });
    } catch (error) {
      console.error('Delete AI review error:', error);
      if (error.message === 'AI Review not found') return res.status(404).json({ message: error.message });
      res.status(500).json({ message: error.message || 'Failed to delete AI review' });
    }
  },

  async generate(req, res) {
    try {
      const reviews = await aiReviewService.generateFromOperationalData();
      res.status(201).json({ data: reviews, message: `Generated ${reviews.length} AI review(s) from operational data` });
    } catch (error) {
      console.error('Generate AI reviews error:', error);
      res.status(500).json({ message: error.message || 'Failed to generate AI reviews' });
    }
  },

  async getDashboardStats(req, res) {
    try {
      const stats = await aiReviewService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error('Get AI review stats error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch AI review stats' });
    }
  },
};
