import React, { useState } from 'react';
import './ShareModal.css';

function ShareModal({ isOpen, onClose, shareUrl, title, type, onShare }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToWhatsApp = () => {
    const message = `Check out this ${type}: ${title}\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    if (onShare) onShare('whatsapp');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    if (onShare) onShare('linkedin');
  };

  const shareToTwitter = () => {
    const text = `Check out this ${type}: ${title}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    if (onShare) onShare('twitter');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    if (onShare) onShare('facebook');
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h3><i className="ri-share-line"></i> Share {type}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="share-modal-content">
          <div className="share-title">
            <p>{title}</p>
          </div>
          
          <div className="share-link-section">
            <div className="share-link-input">
              <input type="text" value={shareUrl} readOnly />
              <button 
                className={`copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <i className="ri-check-line"></i>
                    Copied!
                  </>
                ) : (
                  <>
                    <i className="ri-file-copy-line"></i>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="share-options">
            <h4>Share to:</h4>
            <div className="share-buttons">
              <button className="share-btn whatsapp" onClick={shareToWhatsApp}>
                <i className="ri-whatsapp-line"></i>
                WhatsApp
              </button>
              
              <button className="share-btn linkedin" onClick={shareToLinkedIn}>
                <i className="ri-linkedin-line"></i>
                LinkedIn
              </button>
              
              <button className="share-btn twitter" onClick={shareToTwitter}>
                <i className="ri-twitter-line"></i>
                Twitter
              </button>
              
              <button className="share-btn facebook" onClick={shareToFacebook}>
                <i className="ri-facebook-line"></i>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;