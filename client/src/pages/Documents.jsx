import React, { useState, useEffect } from 'react';
import ResumeTemplates from '../components/Resume/ResumeTemplates';
import ResumeBuilder from '../components/Resume/ResumeBuilder';
import './Documents.css';

function Documents() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setShowBuilder(true);
  };

  const handleBackToTemplates = () => {
    setShowBuilder(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="documents-container">
      {!showBuilder ? (
        <ResumeTemplates onTemplateSelect={handleTemplateSelect} />
      ) : (
        <ResumeBuilder 
          template={selectedTemplate} 
          onBack={handleBackToTemplates}
        />
      )}
    </div>
  );
}

export default Documents;