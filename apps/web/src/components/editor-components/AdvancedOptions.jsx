import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'lucide-react';

const AdvancedEditor = ({resumeMetadata, setResumeMetadata}) => {
  const [selectedLinkIcon, setSelectedLinkIcon] = useState(resumeMetadata?.advancedOptions?.linkIcon || 'none');
  const [reduceDateLocationOpacity, setReduceDateLocationOpacity] = useState(resumeMetadata?.advancedOptions?.reduceDateLocationOpacity || false);

  const linkIconOptions = [
    { id: 'none', label: 'None', icon: null },
    { id: 'external', label: '', icon: 'external' },
    { id: 'link', label: '', icon: 'link' }
  ];

  const handleLinkIconSelect = (iconType) => {
    setSelectedLinkIcon(iconType);
    console.log('Selected link icon:', iconType);
  };

  useEffect(() => {
      setResumeMetadata(prev => ({
        ...prev,
        advancedOptions: {
          ...prev.advancedOptions,
          linkIcon: selectedLinkIcon,
          reduceDateLocationOpacity: reduceDateLocationOpacity
        }
      }));
    }, [selectedLinkIcon, reduceDateLocationOpacity]);

  return (
    <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Advanced</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Link icon</h3>
          <div className="grid grid-cols-3 gap-2">
            {linkIconOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleLinkIconSelect(option.id)}
                className={`p-3 rounded-lg border transition-colors flex items-center justify-center ${
                  selectedLinkIcon === option.id
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.icon === 'external' && (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15,3 21,3 21,9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                )}
                {option.icon === 'link' && <Link className="w-4 h-4" />}
                {option.label && <span className="text-sm">{option.label}</span>}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Date and Location opacity</h3>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="reduce-date-location-opacity"
              checked={reduceDateLocationOpacity}
              onCheckedChange={(checked) => setReduceDateLocationOpacity(!!checked)}
            />
            <label htmlFor="reduce-date-location-opacity" className="text-sm text-gray-700">
              Reduce opacity of dates and locations
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedEditor;
