import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function TestShare() {
  const { shareId } = useParams();
  const [shareData, setShareData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shareId) {
      testShareLink(shareId);
    }
  }, [shareId]);

  const testShareLink = async (id) => {
    try {
      setLoading(true);
      
      // Test internship share link
      const internshipResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/internships/share/${id}`);
      
      if (internshipResponse.ok) {
        const result = await internshipResponse.json();
        setShareData({ type: 'internship', data: result.internship });
        setError(null);
      } else {
        // Test webinar share link
        const webinarResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/webinars/share/${id}`);
        
        if (webinarResponse.ok) {
          const result = await webinarResponse.json();
          setShareData({ type: 'webinar', data: result.webinar });
          setError(null);
        } else {
          // Test admission card share link
          const cardResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/admission-cards/share/${id}`);
          
          if (cardResponse.ok) {
            const result = await cardResponse.json();
            setShareData({ type: 'admission-card', data: result.admissionCard });
            setError(null);
          } else {
            setError('Share link not found or expired');
          }
        }
      }
    } catch (err) {
      setError('Error loading shared content: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateTestShareLink = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/internships/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          internshipId: 'sample-internship-id',
          platform: 'test'
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Test share link created: ${result.shareUrl}`);
      } else {
        alert('Failed to create test share link');
      }
    } catch (error) {
      alert('Error creating test share link: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading shared content...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Share Link Test</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={generateTestShareLink} style={{ padding: '10px 20px', marginTop: '10px' }}>
          Generate Test Share Link
        </button>
      </div>
    );
  }

  if (shareData) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Share Link Working! ✅</h2>
        <p><strong>Type:</strong> {shareData.type}</p>
        <p><strong>Share ID:</strong> {shareId}</p>
        
        {shareData.type === 'internship' && (
          <div>
            <h3>{shareData.data.title}</h3>
            <p><strong>Company:</strong> {shareData.data.company}</p>
            <p><strong>Location:</strong> {shareData.data.location}</p>
            <p><strong>Stipend:</strong> {shareData.data.stipend}</p>
          </div>
        )}
        
        {shareData.type === 'webinar' && (
          <div>
            <h3>{shareData.data.title}</h3>
            <p><strong>Speaker:</strong> {shareData.data.speaker}</p>
            <p><strong>Date:</strong> {new Date(shareData.data.date).toLocaleDateString()}</p>
            <p><strong>Price:</strong> {shareData.data.price}</p>
          </div>
        )}
        
        {shareData.type === 'admission-card' && (
          <div>
            <h3>{shareData.data.examName}</h3>
            <p><strong>Candidate:</strong> {shareData.data.candidateName}</p>
            <p><strong>Roll Number:</strong> {shareData.data.rollNumber}</p>
            <p><strong>Exam Date:</strong> {new Date(shareData.data.examDate).toLocaleDateString()}</p>
          </div>
        )}
        
        <button onClick={() => window.location.href = `/${shareData.type === 'admission-card' ? 'admission-cards' : shareData.type + 's'}/${shareId}`}>
          View Full Details
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Share Link Test</h2>
      <p>No share ID provided</p>
      <button onClick={generateTestShareLink} style={{ padding: '10px 20px' }}>
        Generate Test Share Link
      </button>
    </div>
  );
}

export default TestShare;