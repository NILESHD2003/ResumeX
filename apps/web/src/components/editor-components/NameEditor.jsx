import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from "@/components/ui/button";

const NameEditor = ({ resumeMetadata, setResumeMetadata }) => {
  const [selectedSize, setSelectedSize] = useState(resumeMetadata?.name?.nameSize || 'XL');
  const [isNameBold, setIsNameBold] = useState(resumeMetadata?.name?.bold ?? true);
  const [selectedFontCategory, setSelectedFontCategory] = useState(resumeMetadata?.name?.font || 'body');
  const [selectedFont, setSelectedFont] = useState(resumeMetadata?.name?.creativeFontOption || '');

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];

  const fontCategories = [
    { id: 'body', label: 'Body Font' },
    { id: 'creative', label: 'Creative' }
  ];

  const creativeFont = [
    'Abril Fatface', 'AMATIC SC', 'Bungee Shade', 'Caveat', 'Caveat Brush',
    'Comfortaa', 'Elsie', 'Lobster', 'Pacifico', 'Pressorro', 'Vibes'
  ];

  const getFontStyle = (fontName) => {
    const fontMap = {
      'Abril Fatface': 'Abril Fatface, serif',
      'AMATIC SC': 'Amatic SC, cursive',
      'Bungee Shade': '"Bungee Shade", cursive',
      'Caveat': 'Caveat, cursive',
      'Caveat Brush': '"Caveat Brush", cursive',
      'Comfortaa': 'Comfortaa, cursive',
      'Elsie': 'Elsie, cursive',
      'Lobster': 'Lobster, cursive',
      'Pacifico': 'Pacifico, cursive',
      'Pressorro': 'serif',
      'Vibes': 'cursive'
    };
    return fontMap[fontName] || 'sans-serif';
  };

  useEffect(() => {
    setResumeMetadata(prev => ({
      ...prev,
      name: {
        ...prev.name,
        nameSize: selectedSize,
        bold: isNameBold,
        font: selectedFontCategory,
        creativeFontOption: selectedFont
      }
    }));
  }, [selectedSize, isNameBold, selectedFontCategory, selectedFont]);

  return (
    <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm mx-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Name</h2>

      {/* Size Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
        <div className="flex justify-between w-10 h-10 gap-2">
          {sizeOptions.map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`p-3 text-xs w-full h-full rounded-lg border transition-colors ${
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

      {/* Name Bold Checkbox */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="name-bold"
            checked={isNameBold}
            onCheckedChange={(checked) => setIsNameBold(checked)}
          />
          <label htmlFor="name-bold" className="text-sm font-medium text-gray-700 cursor-pointer">
            Name bold
          </label>
        </div>
      </div>

      {/* Font Category Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Font</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {fontCategories.map(category => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedFontCategory(category.id);
                setSelectedFont(category.id === "creative" ? creativeFont[0] : '');
              }}
              className={`p-3 text-xs rounded-lg border transition-colors ${
                selectedFontCategory === category.id
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Creative Font Selection */}
        {selectedFontCategory === "creative" && (
          <div className="grid grid-cols-3 gap-3">
            {creativeFont.map((font) => (
              <button
                key={font}
                onClick={() => setSelectedFont(font)}
                style={{ fontFamily: getFontStyle(font) }}
                className={`p-2 text-xs rounded-lg border transition-colors ${
                  selectedFont === font
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {font}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NameEditor;
