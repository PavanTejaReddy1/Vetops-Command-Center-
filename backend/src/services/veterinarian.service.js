import { Veterinarian } from '../models/Veterinarian.model.js';

export const veterinarianService = {
  async list({ search, specialization, department, status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' }) {
    const query = { isDeleted: false };

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ];
    }

    if (specialization) {
      query.specialization = specialization;
    }

    if (department) {
      query.department = department;
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [veterinarians, total] = await Promise.all([
      Veterinarian.find(query).sort(sort).skip(skip).limit(limit),
      Veterinarian.countDocuments(query),
    ]);

    return {
      data: veterinarians,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id) {
    const veterinarian = await Veterinarian.findOne({ _id: id, isDeleted: false });
    if (!veterinarian) {
      throw new Error('Veterinarian not found');
    }
    return veterinarian;
  },

  async create(data) {
    try {
      const veterinarian = new Veterinarian(data);
      await veterinarian.save();
      return veterinarian;
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new Error(`A veterinarian with this ${field} already exists`);
      }
      throw error;
    }
  },

  async update(id, data) {
    const veterinarian = await Veterinarian.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true, runValidators: true }
    );

    if (!veterinarian) {
      throw new Error('Veterinarian not found');
    }

    return veterinarian;
  },

  async remove(id) {
    const veterinarian = await Veterinarian.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!veterinarian) {
      throw new Error('Veterinarian not found');
    }

    return veterinarian;
  },
};
