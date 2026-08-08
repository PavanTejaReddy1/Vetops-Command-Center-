import { User } from '../models/User.model.js';

export const userService = {
  async list({ search, role, isActive, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = {}) {
    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) query.role = role;
    if (isActive !== undefined && isActive !== '') {
      query.isActive = isActive === 'true' || isActive === true;
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [users, total] = await Promise.all([
      User.find(query).select('-password -resetPasswordToken -resetPasswordExpires').sort(sort).skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    return {
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getById(id) {
    const user = await User.findById(id).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) throw new Error('User not found');
    return user;
  },

  async create(data) {
    try {
      const existing = await User.findOne({ email: data.email });
      if (existing) throw new Error('A user with this email already exists');

      const user = new User(data);
      await user.save();
      return await User.findById(user._id).select('-password -resetPasswordToken -resetPasswordExpires');
    } catch (error) {
      if (error.code === 11000) throw new Error('A user with this email already exists');
      throw error;
    }
  },

  async update(id, data) {
    // Never allow updating password via this path
    delete data.password;

    const user = await User.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires');

    if (!user) throw new Error('User not found');
    return user;
  },

  async remove(id) {
    // Soft delete by deactivating
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  },

  async invite(data, invitedById) {
    try {
      const existing = await User.findOne({ email: data.email });
      if (existing) throw new Error('A user with this email already exists');

      // Create user with a temporary password they must reset
      const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';
      const user = new User({
        ...data,
        password: tempPassword,
        invitedBy: invitedById,
        invitedAt: new Date(),
        isActive: true,
      });
      await user.save();
      return await User.findById(user._id).select('-password -resetPasswordToken -resetPasswordExpires');
    } catch (error) {
      if (error.code === 11000) throw new Error('A user with this email already exists');
      throw error;
    }
  },

  async toggleActive(id, isActive) {
    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  },
};
