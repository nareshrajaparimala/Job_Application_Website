// Test function to verify share link functionality
export const testInternshipShareLink = async (internshipId) => {
  try {
    console.log('Testing share link for internship ID:', internshipId);
    
    // Test 1: Create share link
    const shareResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/internships/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        internshipId: internshipId,
        platform: 'test'
      })
    });

    if (!shareResponse.ok) {
      console.error('Share creation failed:', shareResponse.status);
      return false;
    }

    const shareResult = await shareResponse.json();
    console.log('Share link created:', shareResult.shareUrl);

    // Test 2: Access shared internship
    const accessResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/internships/share/${internshipId}`);
    
    if (!accessResponse.ok) {
      console.error('Share access failed:', accessResponse.status);
      return false;
    }

    const accessResult = await accessResponse.json();
    console.log('Share link accessible:', accessResult.success);
    console.log('Internship data:', accessResult.internship?.title);

    return {
      success: true,
      shareUrl: shareResult.shareUrl,
      internshipData: accessResult.internship,
      urlMatches: shareResult.shareUrl.includes(internshipId)
    };

  } catch (error) {
    console.error('Share link test failed:', error);
    return false;
  }
};