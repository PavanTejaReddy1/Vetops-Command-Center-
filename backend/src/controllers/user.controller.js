import { userService } from '../services/user.service.js';

export const userController = {
  async list(req, res) {
    try {
      const { search, role, isActive, page, limit, sortBy, sortOrder } = req.query;
      const result = await userService.list({
        search,
        role,
        isActive,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        sortBy: sortBy || 'createdAt',
        sortOrder: sortOrder || 'desc',
      });
      res.json(result);
    } catch (error) {
      console.error('List users error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch users' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getById(id);
      res.json({ data: user });
    } catch (error) {
      console.error('Get user error:', error);
      if (error.message === 'User not found') return res.status(404).json({ message: error.message });
      res.status(500).json({ message: error.message || 'Failed to fetch user' });
    }
  },

  async create(req, res) {
    try {
      const { email, password, firstName, lastName, role, department, phone, jobTitle } = req.body;
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: 'email, password, firstName, and lastName are required' });
      }
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      const user = await userService.create({ email, password, firstName, lastName, role, department, phone, jobTitle });
      res.status(201).json({ data: user, message: 'User created successfully' });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(400).json({ message: error.message || 'Failed to create user' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.update(id, req.body);
      res.json({ data: user, message: 'User updated successfully' });
    } catch (error) {
      console.error('Update user error:', error);
      if (error.message === 'User not found') return res.status(404).json({ message: error.message });
      res.status(400).json({ message: error.message || 'Failed to update user' });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      await userService.remove(id);
      res.json({ message: 'User deactivated successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      if (error.message === 'User not found') return res.status(404).json({ message: error.message });
      res.status(500).json({ message: error.message || 'Failed to deactivate user' });
    }
  },

  async invite(req, res) {
    try {
      const { email, firstName, lastName, role, department, phone, jobTitle } = req.body;
      if (!email || !firstName || !lastName) {
        return res.status(400).json({ message: 'email, firstName, and lastName are required' });
      }
      const user = await userService.invite(
        { email, firstName, lastName, role: role || 'field_staff', department, phone, jobTitle },
        req.user?.id
      );
      res.status(201).json({ data: user, message: 'User invited successfully' });
    } catch (error) {
      console.error('Invite user error:', error);
      res.status(400).json({ message: error.message || 'Failed to invite user' });
    }
  },

  async toggleActive(req, res) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      if (isActive === undefined) return res.status(400).json({ message: 'isActive field is required' });
      const user = await userService.toggleActive(id, isActive);
      res.json({ data: user, message: `User ${isActive ? 'activated' : 'deactivated'} successfully` });
    } catch (error) {
      console.error('Toggle active error:', error);
      if (error.message === 'User not found') return res.status(404).json({ message: error.message });
      res.status(500).json({ message: error.message || 'Failed to update user status' });
    }
  },
};
