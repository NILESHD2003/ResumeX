import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const JobTitleEditor = () => {
  const [selectedSize, setSelectedSize] = useState('S');
  const [selectedPosition, setSelectedPosition] = useState('Below');
  const [selectedStyle, setSelectedStyle] = useState('Normal');

  const sizeOptions = ['S', 'M', 'L'];
  const positionOptions = [
    { id: 'same-line', label: 'Try Same Line' },
    { id: 'below', label: 'Below' }
  ];
  const styleOptions = [
    { id: 'normal', label: 'Normal' },
    { id: 'italic', label: 'Italic' }
  ];

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    console.log('Selected size:', size);
  };

  const handlePositionSelect = (position) => {
    setSelectedPosition(position);
    console.log('Selected position:', position);
  };

  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
    console.log('Selected style:', style);
  };

  return (
    <div className="w-80 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Job Title</h2>

      {/* Size Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
        <div className="flex gap-2">
          {sizeOptions.map((size) => (
            <Button
              key={size}
              variant={selectedSize === size ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSizeSelect(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Position Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Position</h3>
        <div className="grid grid-cols-2 gap-2">
          {positionOptions.map((position) => (
            <Button
              key={position.id}
              variant={selectedPosition === position.label ? 'default' : 'outline'}
              onClick={() => handlePositionSelect(position.label)}
            >
              {position.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Style Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Style</h3>
        <div className="grid grid-cols-2 gap-2">
          {styleOptions.map((style) => (
            <Button
              key={style.id}
              variant={selectedStyle === style.label ? 'default' : 'outline'}
              className={style.id === 'italic' ? 'italic' : ''}
              onClick={() => handleStyleSelect(style.label)}
            >
              {style.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobTitleEditor;
