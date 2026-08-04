import { Admin } from '../models/User.model.js';
import { generateToken } from '../utils/jwt.js';

export const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const admin = await Admin.findOne({ email, isActive: true });

      if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await admin.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      admin.lastLogin = new Date();
      await admin.save();

      const token = generateToken({
        id: admin._id,
        email: admin.email,
        role: admin.role,
      });

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: admin._id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getProfile(req, res) {
    try {
      const admin = await Admin.findById(req.user.id);

      if (!admin) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        user: {
          id: admin._id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role,
          lastLogin: admin.lastLogin,
        },
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async logout(req, res) {
    res.json({ message: 'Logout successful' });
  },
};
