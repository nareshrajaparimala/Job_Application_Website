import Application from '../models/applicationModel.js';
import ResumeApplication from '../models/resumeApplicationModel.js';

// Clean up applications older than 10 days
export const cleanupOldApplications = async () => {
  try {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    // Delete old general applications
    const deletedApplications = await Application.deleteMany({
      appliedAt: { $lt: tenDaysAgo }
    });

    // Delete old resume applications
    const deletedResumeApplications = await ResumeApplication.deleteMany({
      appliedAt: { $lt: tenDaysAgo }
    });

    console.log(`Cleanup completed: ${deletedApplications.deletedCount} general applications and ${deletedResumeApplications.deletedCount} resume applications deleted`);
    
    return {
      generalApplications: deletedApplications.deletedCount,
      resumeApplications: deletedResumeApplications.deletedCount
    };
  } catch (error) {
    console.error('Cleanup error:', error);
    return { error: error.message };
  }
};

// Run cleanup every 24 hours
export const startCleanupScheduler = () => {
  // Run cleanup immediately on startup
  cleanupOldApplications();
  
  // Then run every 24 hours
  setInterval(cleanupOldApplications, 24 * 60 * 60 * 1000);
  console.log('Cleanup scheduler started - will run every 24 hours');
};