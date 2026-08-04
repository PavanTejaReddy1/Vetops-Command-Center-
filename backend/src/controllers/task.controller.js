import { taskService } from '../services/task.service.js';
import { validators } from '../validators/index.js';
import { Task } from '../models/Task.model.js';

export const taskController = {
  async list(req, res) {
    try {
      const { search, assignee, priority, status, dueDate, page, limit, sortBy, sortOrder } = req.query;
      const result = await taskService.list({
        search,
        assignee,
        priority,
        status,
        dueDate,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        sortBy: sortBy || 'createdAt',
        sortOrder: sortOrder || 'desc',
      });
      res.json(result);
    } catch (error) {
      console.error('List tasks error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch tasks' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const task = await taskService.getById(id);
      res.json({ data: task });
    } catch (error) {
      console.error('Get task error:', error);
      if (error.message === 'Task not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message || 'Failed to fetch task' });
    }
  },

  async create(req, res) {
    try {
      const validationResult = validators.createTask.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: validationResult.error.errors 
        });
      }
      const data = validationResult.data;
      const task = await taskService.create(data);
      res.status(201).json({ data: task, message: 'Task created successfully' });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(400).json({ message: error.message || 'Failed to create task' });
    }
  },

  async update(req, res) {
    try {
      const validationResult = validators.updateTask.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: validationResult.error.errors 
        });
      }
      const { id } = req.params;
      const data = validationResult.data;
      const task = await taskService.update(id, data);
      res.json({ data: task, message: 'Task updated successfully' });
    } catch (error) {
      console.error('Update task error:', error);
      if (error.message === 'Task not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: error.message || 'Failed to update task' });
    }
  },

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status || !['Pending', 'In Progress', 'Completed', 'Cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      const task = await taskService.update(id, { status });
      res.json({ data: task, message: 'Task status updated successfully' });
    } catch (error) {
      console.error('Update task status error:', error);
      if (error.message === 'Task not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message || 'Failed to update task status' });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      await taskService.remove(id);
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Delete task error:', error);
      if (error.message === 'Task not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message || 'Failed to delete task' });
    }
  },

  async getDashboardStats(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const [pendingTasks, completedTasks, overdueTasks] = await Promise.all([
        Task.countDocuments({ status: 'Pending', isDeleted: false }),
        Task.countDocuments({ status: 'Completed', isDeleted: false }),
        Task.countDocuments({ 
          status: { $ne: 'Completed' }, 
          dueDate: { $lt: today },
          isDeleted: false 
        }),
      ]);

      const recentTasks = await Task.find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('assignedTo', 'fullName email');

      res.json({
        pendingTasks,
        completedTasks,
        overdueTasks,
        recentTasks,
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch dashboard stats' });
    }
  },
};
