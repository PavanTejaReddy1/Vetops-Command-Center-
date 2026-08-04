import 'dotenv/config';
import mongoose from 'mongoose';
import { Admin } from '../src/models/User.model.js';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await Admin.findOne({ email: 'admin@vetops.com' });

    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = new Admin({
      email: 'admin@vetops.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@vetops.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login');

  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
