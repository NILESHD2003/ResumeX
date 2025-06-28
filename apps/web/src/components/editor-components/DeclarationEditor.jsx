import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

const DeclarationEditor = ({resumeMetadata, setResumeMetadata}) => {
  const [showSectionHeading, setShowSectionHeading] = useState(resumeMetadata?.declaration?.showHeading || true);
  const [position, setPosition] = useState(resumeMetadata?.declaration?.declarationPosition || 'left');
  const [showLine, setShowLine] = useState(resumeMetadata?.declaration?.showLine || false);

  const positionOptions = [
    { id: 'left', label: 'Left' },
    { id: 'right', label: 'Right' }
  ];

  const handlePositionSelect = (selectedPosition) => {
    setPosition(selectedPosition);
    console.log('Selected declaration position:', selectedPosition);
  };

  useEffect(() => {
    setResumeMetadata(prev => ({
      ...prev,
      declaration: {
        ...prev.declaration,
        showHeading: showSectionHeading,
        declarationPosition: position,
        showLine: showLine
      }
    }));
  }, [showSectionHeading, position, showLine]);

  return (
    <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Declaration</h2>

      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="show-section-heading"
            checked={showSectionHeading}
            onCheckedChange={(checked) => setShowSectionHeading(!!checked)}
          />
          <label htmlFor="show-section-heading" className="text-sm text-gray-700">
            Show section heading
          </label>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Position</h3>
          <div className="grid grid-cols-2 gap-2">
            {positionOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handlePositionSelect(option.id)}
                className={`p-3 rounded-lg border transition-colors ${
                  position === option.id
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Line</h3>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="show-line"
              checked={showLine}
              onCheckedChange={(checked) => setShowLine(!!checked)}
            />
            <label htmlFor="show-line" className="text-sm text-gray-700">
              Show line
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeclarationEditor;
