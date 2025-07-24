import User from '../modules/user/schemas/user.schema';
import { Helpers } from '../modules/shared/utils/helpers';

export const initializeAdmin = async (): Promise<void> => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ 
      role: 'admin'
    });

    if (adminExists) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Get admin credentials from environment
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@talabat.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.warn('⚠️ Using default admin credentials. Please set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file');
    }

    // Hash password
    const hashedPassword = await Helpers.hashPassword(adminPassword);

    // Create admin user
    const admin = new User({
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin',
      isActive: true,
      isEmailVerified: true
    });

    await admin.save();

    console.log('✅ Admin user created successfully');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log('⚠️ Please change the admin password after first login');

  } catch (error) {
    console.error('❌ Failed to initialize admin user:', error);
    throw error;
  }
};

// Database cleanup and maintenance tasks
export const performDatabaseMaintenance = async (): Promise<void> => {
  try {
    // Clean up inactive users older than 30 days (if needed)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Here you could add cleanup logic for inactive unverified users
    
    console.log('✅ Database maintenance completed');
  } catch (error) {
    console.error('❌ Database maintenance failed:', error);
  }
};

// Initialize application
export const initializeApp = async (): Promise<void> => {
  try {
    console.log('🚀 Initializing Talabat API...');
    
    // Initialize admin user
    await initializeAdmin();
    
    // Perform database maintenance
    await performDatabaseMaintenance();
    
    console.log('✅ Application initialized successfully');
  } catch (error) {
    console.error('❌ Application initialization failed:', error);
    throw error;
  }
};
