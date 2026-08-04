import { auditLogService } from '../services/auditLog.service.js';

export const auditLogController = {
  async list(req, res) {
    try {
      const { user, module, action, search, page, limit, sortBy, sortOrder } = req.query;
      const result = await auditLogService.list({ user, module, action, search, page, limit, sortBy, sortOrder });
      res.json(result);
    } catch (error) {
      console.error('List audit logs error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch audit logs' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const log = await auditLogService.getById(id);
      res.json({ data: log });
    } catch (error) {
      console.error('Get audit log error:', error);
      res.status(404).json({ message: error.message || 'Audit log not found' });
    }
  },

  async create(req, res) {
    try {
      const log = await auditLogService.create(req.body);
      res.status(201).json({ data: log });
    } catch (error) {
      console.error('Create audit log error:', error);
      res.status(500).json({ message: error.message || 'Failed to create audit log' });
    }
  },

  async export(req, res) {
    try {
      const { format } = req.params;
      const { user, module, action, search } = req.query;
      
      const result = await auditLogService.list({ user, module, action, search, limit: 10000 });
      
      if (format === 'csv') {
        const csv = convertToCSV(result.data);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="audit-logs-${Date.now()}.csv"`);
        return res.send(csv);
      } else if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="audit-logs-${Date.now()}.json"`);
        return res.json(result.data);
      } else {
        return res.status(400).json({ message: 'Invalid format. Use csv or json' });
      }
    } catch (error) {
      console.error('Export audit logs error:', error);
      res.status(500).json({ message: error.message || 'Failed to export audit logs' });
    }
  },
};

function convertToCSV(data) {
  const flattenObject = (obj, prefix = '') => {
    const result = {};
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        const nested = flattenObject(obj[key], prefix + key + '.');
        Object.assign(result, nested);
      } else if (Array.isArray(obj[key])) {
        result[prefix + key] = JSON.stringify(obj[key]);
      } else {
        result[prefix + key] = obj[key];
      }
    }
    return result;
  };

  const items = Array.isArray(data) ? data : [data];
  if (items.length === 0) return '';

  const flattened = items.map(item => flattenObject(item));
  const headers = Object.keys(flattened[0]).join(',');
  const rows = flattened.map(item => Object.values(item).join(','));
  
  return [headers, ...rows].join('\n');
}
