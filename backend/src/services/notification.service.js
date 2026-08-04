import { Notification } from '../models/Notification.model.js';

export const notificationService = {
  async list({ recipient, type, module, read, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = {}) {
    const query = { isDeleted: false };
    if (recipient) query.recipient = recipient;
    if (type) query.type = type;
    if (module) query.module = module;
    if (read !== undefined) query.read = read === 'true' ? true : read === 'false' ? false : read;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [notifications, total] = await Promise.all([
      Notification.find(query).sort(sort).skip(skip).limit(limit),
      Notification.countDocuments(query),
    ]);

    return {
      data: notifications,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getById(id) {
    const notification = await Notification.findOne({ _id: id, isDeleted: false });
    if (!notification) {
      throw new Error('Notification not found');
    }
    return notification;
  },

  async create(data) {
    const lastNotification = await Notification.findOne().sort({ createdAt: -1 });
    const lastId = lastNotification ? parseInt(lastNotification.notificationId.split('-')[1]) : 0;
    const notificationId = `NOT-${String(lastId + 1).padStart(6, '0')}`;

    const notification = new Notification({
      notificationId,
      ...data,
    });

    await notification.save();
    return notification;
  },

  async markAsRead(id) {
    const notification = await Notification.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { read: true },
      { new: true }
    );
    if (!notification) {
      throw new Error('Notification not found');
    }
    return notification;
  },

  async markAllAsRead(recipient) {
    const result = await Notification.updateMany(
      { recipient, read: false, isDeleted: false },
      { read: true }
    );
    return { modifiedCount: result.modifiedCount };
  },

  async remove(id) {
    const notification = await Notification.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!notification) {
      throw new Error('Notification not found');
    }
    return notification;
  },

  async getUnreadCount(recipient) {
    const count = await Notification.countDocuments({
      recipient,
      read: false,
      isDeleted: false,
    });
    return count;
  },
};
