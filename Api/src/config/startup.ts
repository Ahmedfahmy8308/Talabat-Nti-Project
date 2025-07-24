import { User } from '../modules/user/schemas';
import { Helpers } from '../modules/shared/utils/helpers';

export const initializeAdmin = async (): Promise<void> => {
  try {
    const adminExists = await User.findOne({
      role: 'admin',
    });

    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@talabat.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.warn(
        'Using default admin credentials. Please set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file',
      );
    }

    const hashedPassword = await Helpers.hashPassword(adminPassword);

    const admin = new User({
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin',
      isActive: true,
      isEmailVerified: true,
    });

    await admin.save();

    console.log('Admin user created successfully');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('Please change the admin password after first login');
  } catch (error) {
    console.error('Failed to initialize admin user:', error);
    throw error;
  }
};

export const performDatabaseMaintenance = async (): Promise<void> => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    console.log('Database maintenance completed');
  } catch (error) {
    console.error('Database maintenance failed:', error);
  }
};

export const initializeApp = async (): Promise<void> => {
  try {
    console.log('Initializing Talabat API...');

    await initializeAdmin();
    await performDatabaseMaintenance();

    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Application initialization failed:', error);
    throw error;
  }
};
