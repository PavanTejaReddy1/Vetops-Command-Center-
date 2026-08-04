import { AuditLog } from '../models/AuditLog.model.js';

export async function auditLogger(req, res, next) {
  const originalSend = res.send;
  
  res.send = function(data) {
    res.send = originalSend;
    
    if (res.statusCode >= 200 && res.statusCode < 300 && req.method !== 'GET') {
      logAction(req, res, data);
    }
    
    return originalSend.call(this, data);
  };
  
  next();
}

async function logAction(req, res, data) {
  try {
    const user = req.user?._id;
    const action = getActionFromMethod(req.method, req.originalUrl);
    const module = getModuleFromPath(req.originalUrl);
    const resourceId = getResourceId(req);
    
    const lastAuditLog = await AuditLog.findOne().sort({ createdAt: -1 });
    const lastId = lastAuditLog ? parseInt(lastAuditLog.auditId.split('-')[1]) : 0;
    const auditId = `AUD-${String(lastId + 1).padStart(6, '0')}`;
    
    await AuditLog.create({
      auditId,
      user,
      action,
      module,
      resourceId,
      description: generateDescription(action, module, resourceId),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      metadata: {
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
      },
    });
  } catch (error) {
    console.error('Failed to log audit action:', error);
  }
}

function getActionFromMethod(method, path) {
  const actionMap = {
    POST: 'Created',
    PUT: 'Updated',
    PATCH: 'Updated',
    DELETE: 'Deleted',
  };
  
  if (path.includes('/login')) return 'Logged In';
  if (path.includes('/logout')) return 'Logged Out';
  
  return actionMap[method] || 'Action';
}

function getModuleFromPath(path) {
  if (path.includes('/auth')) return 'auth';
  if (path.includes('/users')) return 'users';
  if (path.includes('/veterinarians')) return 'veterinarians';
  if (path.includes('/appointments')) return 'appointments';
  if (path.includes('/tasks')) return 'tasks';
  if (path.includes('/predictions')) return 'predictions';
  if (path.includes('/forecasts')) return 'forecasts';
  if (path.includes('/reports')) return 'reports';
  if (path.includes('/settings')) return 'settings';
  return 'system';
}

function getResourceId(req) {
  if (req.params.id) return req.params.id;
  if (req.body._id) return req.body._id;
  if (req.body.notificationId) return req.body.notificationId;
  if (req.body.appointmentId) return req.body.appointmentId;
  if (req.body.taskId) return req.body.taskId;
  if (req.body.predictionId) return req.body.predictionId;
  return null;
}

function generateDescription(action, module, resourceId) {
  const resourceMap = {
    auth: 'Authentication',
    users: 'User',
    veterinarians: 'Veterinarian',
    appointments: 'Appointment',
    tasks: 'Task',
    predictions: 'AI Prediction',
    forecasts: 'Forecast',
    reports: 'Report',
    settings: 'Settings',
    system: 'System',
  };
  
  const resource = resourceMap[module] || 'Resource';
  
  if (action === 'Logged In') return 'User logged in';
  if (action === 'Logged Out') return 'User logged out';
  
  return `${resource} ${action.toLowerCase()}${resourceId ? ` (${resourceId})` : ''}`;
}
