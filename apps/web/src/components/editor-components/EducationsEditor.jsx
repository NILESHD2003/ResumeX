import React, { useState, useEffect } from 'react';

const EducationEditor = ({resumeMetadata, setResumeMetadata}) => {
  const [selectedFormat, setSelectedFormat] = useState(resumeMetadata?.education?.titleSubtitleOrder || 'degree-school');

  const formatOptions = [
    { id: 'degree-school', label: 'Degree - School' },
    { id: 'school-degree', label: 'School - Degree' }
  ];

  const handleFormatSelect = (format) => {
    setSelectedFormat(format);
    console.log('Selected education format:', format);
  };

  useEffect(() => {
    setResumeMetadata(prev => ({
      ...prev,
      education: {
        ...prev.education,
        titleSubtitleOrder: selectedFormat
      }
    }));
  }, [selectedFormat]);

  return (
    <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Education</h2>

      <div className="grid grid-cols-2 gap-2">
        {formatOptions.map((format) => (
          <button
            key={format.id}
            onClick={() => handleFormatSelect(format.id)}
            className={`p-3 rounded-lg border transition-colors ${
              selectedFormat === format.id
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-sm">{format.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EducationEditor;
