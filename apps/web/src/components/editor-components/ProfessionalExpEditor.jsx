import React, { useState, useEffect } from 'react';

const ProfessionalExperienceEditor = ({resumeMetadata, setResumeMetadata}) => {
  const [titleOrder, setTitleOrder] = useState(resumeMetadata?.professionalExperience?.titleSubtitleOrder || 'jobTitle-Employer');

  const titleOrderOptions = [
    { id: 'jobTitle-Employer', label: 'Job Title - Employer' },
    { id: 'employer-JobTitle', label: 'Employer - Job Title' }
  ];

  const handleTitleOrderSelect = (order) => {
    setTitleOrder(order);
    console.log('Selected title order:', order);
  };

  useEffect(() => {
    setResumeMetadata(prev => ({
      ...prev,
      professionalExperience: {
        ...prev.professionalExperience,
        titleSubtitleOrder: titleOrder
      }
    }));
  }, [titleOrder]);
  
  return (
    <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Professional Experience</h2>

        <div>
          <div className="grid grid-cols-2 gap-2">
            {titleOrderOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleTitleOrderSelect(option.id)}
                className={`p-3 rounded-lg border transition-colors ${
                  titleOrder === option.id
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm">{option.label}</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalExperienceEditor;
