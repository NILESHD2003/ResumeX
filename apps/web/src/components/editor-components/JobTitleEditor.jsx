import React, { useState, useEffect } from 'react';

const JobTitleEditor = ({ resumeMetadata, setResumeMetadata }) => {
  const [selectedSize, setSelectedSize] = useState(resumeMetadata?.jobTitle?.jobTitleSize || 'S');
  const [selectedPosition, setSelectedPosition] = useState(resumeMetadata?.jobTitle?.position || 'below');
  const [selectedStyle, setSelectedStyle] = useState(resumeMetadata?.jobTitle?.jobTitleStyle || 'normal');

  const sizeOptions = ['S', 'M', 'L'];
  const positionOptions = [
    { id: 'same-line', label: 'Try Same Line' },
    { id: 'below', label: 'Below' }
  ];
  const styleOptions = [
    { id: 'normal', label: 'Normal' },
    { id: 'italic', label: 'Italic' }
  ];

  useEffect(() => {
    setResumeMetadata(prev => ({
      ...prev,
      jobTitle: {
        ...prev.jobTitle,
        jobTitleSize: selectedSize,
        position: selectedPosition,
        jobTitleStyle: selectedStyle,
      }
    }));
  }, [selectedSize, selectedStyle, selectedPosition]);

  return (
    <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Job Title</h2>

      {/* Size Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
        <div className="flex gap-2">
          {sizeOptions.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`p-3 text-xs rounded-lg border transition-colors ${
                selectedSize === size
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Position Section */}
      {/* <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Position</h3>
        <div className="grid grid-cols-2 gap-2">
          {positionOptions.map((position) => (
            <button
              key={position.id}
              onClick={() => setSelectedPosition(position.id)}
              className={`p-3 text-xs rounded-lg border transition-colors ${
                selectedPosition === position.id
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {position.label}
            </button>
          ))}
        </div>
      </div> */}

      {/* Style Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Style</h3>
        <div className="grid grid-cols-2 gap-2">
          {styleOptions.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`p-3 text-xs rounded-lg border transition-colors ${
                selectedStyle === style.id
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              } ${style.id === 'italic' ? 'italic' : ''}`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobTitleEditor;
