import { Appointment } from '../models/Appointment.model.js';

export const appointmentService = {
  async list({ search, veterinarian, date, priority, status, page = 1, limit = 10, sortBy = 'appointmentDate', sortOrder = 'asc' }) {
    const query = { isDeleted: false };

    if (search) {
      query.$or = [
        { petName: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { appointmentId: { $regex: search, $options: 'i' } },
      ];
    }

    if (veterinarian) {
      query.veterinarian = veterinarian;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: startDate, $lte: endDate };
    }

    if (priority) {
      query.priority = priority;
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [appointments, total] = await Promise.all([
      Appointment.find(query).populate('veterinarian', 'fullName email').sort(sort).skip(skip).limit(limit),
      Appointment.countDocuments(query),
    ]);

    return {
      data: appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id) {
    const appointment = await Appointment.findOne({ _id: id, isDeleted: false }).populate('veterinarian', 'fullName email');
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    return appointment;
  },

  async create(data) {
    try {
      const appointment = new Appointment(data);
      await appointment.save();
      return await Appointment.findById(appointment._id).populate('veterinarian', 'fullName email');
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new Error(`An appointment with this ${field} already exists`);
      }
      throw error;
    }
  },

  async update(id, data) {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true, runValidators: true }
    ).populate('veterinarian', 'fullName email');

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    return appointment;
  },

  async remove(id) {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    return appointment;
  },

  async checkOverlap(veterinarian, appointmentDate, appointmentTime, durationMins, excludeId = null) {
    const query = {
      veterinarian,
      appointmentDate,
      status: { $ne: 'Cancelled' },
      isDeleted: false,
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const appointments = await Appointment.find(query);
    
    const newStartTime = this._parseTime(appointmentTime);
    const newEndTime = new Date(newStartTime.getTime() + durationMins * 60000);

    for (const apt of appointments) {
      const existingStartTime = this._parseTime(apt.appointmentTime);
      const existingEndTime = new Date(existingStartTime.getTime() + apt.durationMins * 60000);

      if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
        throw new Error('This veterinarian has an overlapping appointment at this time');
      }
    }

    return false;
  },

  _parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  },
};
