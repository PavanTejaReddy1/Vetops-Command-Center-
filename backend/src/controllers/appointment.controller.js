import { appointmentService } from '../services/appointment.service.js';
import { validators } from '../validators/index.js';
import { Appointment } from '../models/Appointment.model.js';

export const appointmentController = {
  async list(req, res) {
    try {
      const { search, veterinarian, date, priority, status, page, limit, sortBy, sortOrder } = req.query;
      const result = await appointmentService.list({
        search,
        veterinarian,
        date,
        priority,
        status,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        sortBy: sortBy || 'appointmentDate',
        sortOrder: sortOrder || 'asc',
      });
      res.json(result);
    } catch (error) {
      console.error('List appointments error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch appointments' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.getById(id);
      res.json({ data: appointment });
    } catch (error) {
      console.error('Get appointment error:', error);
      if (error.message === 'Appointment not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message || 'Failed to fetch appointment' });
    }
  },

  async create(req, res) {
    try {
      const validationResult = validators.createAppointment.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: validationResult.error.errors 
        });
      }
      const data = validationResult.data;
      
      await appointmentService.checkOverlap(
        data.veterinarian,
        new Date(data.appointmentDate),
        data.appointmentTime,
        data.durationMins || 30
      );
      
      const appointment = await appointmentService.create(data);
      res.status(201).json({ data: appointment, message: 'Appointment created successfully' });
    } catch (error) {
      console.error('Create appointment error:', error);
      res.status(400).json({ message: error.message || 'Failed to create appointment' });
    }
  },

  async update(req, res) {
    try {
      const validationResult = validators.updateAppointment.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: validationResult.error.errors 
        });
      }
      const { id } = req.params;
      const data = validationResult.data;
      
      const existing = await appointmentService.getById(id);
      
      if (data.veterinarian && data.appointmentDate && data.appointmentTime) {
        await appointmentService.checkOverlap(
          data.veterinarian,
          new Date(data.appointmentDate),
          data.appointmentTime,
          data.durationMins || existing.durationMins,
          id
        );
      }
      
      const appointment = await appointmentService.update(id, data);
      res.json({ data: appointment, message: 'Appointment updated successfully' });
    } catch (error) {
      console.error('Update appointment error:', error);
      if (error.message === 'Appointment not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: error.message || 'Failed to update appointment' });
    }
  },

  async cancel(req, res) {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.update(id, { status: 'Cancelled' });
      res.json({ data: appointment, message: 'Appointment cancelled successfully' });
    } catch (error) {
      console.error('Cancel appointment error:', error);
      if (error.message === 'Appointment not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message || 'Failed to cancel appointment' });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      await appointmentService.remove(id);
      res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      console.error('Delete appointment error:', error);
      if (error.message === 'Appointment not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message || 'Failed to delete appointment' });
    }
  },

  async getDashboardStats(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const [todayAppointments, upcomingAppointments, completedAppointments] = await Promise.all([
        Appointment.countDocuments({
          appointmentDate: { $gte: today, $lte: endOfDay },
          isDeleted: false,
        }),
        Appointment.countDocuments({
          appointmentDate: { $gte: today },
          status: { $in: ['Scheduled', 'In Progress'] },
          isDeleted: false,
        }),
        Appointment.countDocuments({
          status: 'Completed',
          isDeleted: false,
        }),
      ]);

      res.json({
        todayAppointments,
        upcomingAppointments,
        completedAppointments,
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch dashboard stats' });
    }
  },
};
