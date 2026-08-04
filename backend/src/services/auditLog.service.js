import { AuditLog } from '../models/AuditLog.model.js';

export const auditLogService = {
  async list({ user, module, action, search, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = {}) {
    const query = {};
    if (user) query.user = user;
    if (module) query.module = module;
    if (action) query.action = { $regex: action, $options: 'i' };
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } },
        { resourceId: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [logs, total] = await Promise.all([
      AuditLog.find(query).sort(sort).skip(skip).limit(limit).populate('user', 'firstName lastName email'),
      AuditLog.countDocuments(query),
    ]);

    return {
      data: logs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getById(id) {
    const log = await AuditLog.findById(id).populate('user', 'firstName lastName email');
    if (!log) {
      throw new Error('Audit log not found');
    }
    return log;
  },

  async create(data) {
    const lastAuditLog = await AuditLog.findOne().sort({ createdAt: -1 });
    const lastId = lastAuditLog ? parseInt(lastAuditLog.auditId.split('-')[1]) : 0;
    const auditId = `AUD-${String(lastId + 1).padStart(6, '0')}`;

    const log = new AuditLog({
      auditId,
      ...data,
    });

    await log.save();
    return log;
  },
};
