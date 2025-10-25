// Test script to verify share link functionality
import fetch from 'node-fetch';

const testShareLink = async () => {
  try {
    // Test creating a share link
    const shareResponse = await fetch('https://api.mytechz.in/api/internships/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        internshipId: 'test-internship-id',
        platform: 'test'
      })
    });

    if (shareResponse.ok) {
      const shareResult = await shareResponse.json();
      console.log('Share link created:', shareResult.shareUrl);
      
      // Test accessing the shared internship
      const accessResponse = await fetch(`https://api.mytechz.in/api/internships/share/test-internship-id`);
      
      if (accessResponse.ok) {
        const accessResult = await accessResponse.json();
        console.log('Share link accessible:', accessResult.success);
      } else {
        console.log('Share link not accessible');
      }
    } else {
      console.log('Failed to create share link');
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

testShareLink();