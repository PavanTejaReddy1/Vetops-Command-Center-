import { Task } from '../models/Task.model.js';

export const taskService = {
  async list({ search, assignee, priority, status, dueDate, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' }) {
    const query = { isDeleted: false };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { taskId: { $regex: search, $options: 'i' } },
      ];
    }

    if (assignee) {
      query.assignedTo = assignee;
    }

    if (priority) {
      query.priority = priority;
    }

    if (status) {
      query.status = status;
    }

    if (dueDate) {
      const startDate = new Date(dueDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(dueDate);
      endDate.setHours(23, 59, 59, 999);
      query.dueDate = { $gte: startDate, $lte: endDate };
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [tasks, total] = await Promise.all([
      Task.find(query).populate('assignedTo', 'fullName email').sort(sort).skip(skip).limit(limit),
      Task.countDocuments(query),
    ]);

    return {
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id) {
    const task = await Task.findOne({ _id: id, isDeleted: false }).populate('assignedTo', 'fullName email');
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  },

  async create(data) {
    try {
      const task = new Task(data);
      await task.save();
      return await Task.findById(task._id).populate('assignedTo', 'fullName email');
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new Error(`A task with this ${field} already exists`);
      }
      throw error;
    }
  },

  async update(id, data) {
    const task = await Task.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'fullName email');

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  },

  async remove(id) {
    const task = await Task.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  },
};
