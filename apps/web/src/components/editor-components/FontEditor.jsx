import React, { useState, useEffect } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const FontEditor = ({resumeMetadata, setResumeMetadata}) => {
  const [selectedCategory, setSelectedCategory] = useState(resumeMetadata?.font?.fontCategory || 'serif');
  const [selectedFont, setSelectedFont] = useState(resumeMetadata?.font?.fontFamily || 'Amiri');

  const fontCategories = [
    { id: 'serif', label: 'Serif', preview: 'Aa' },
    { id: 'sans', label: 'Sans', preview: 'Aa' },
    { id: 'mono', label: 'Mono', preview: 'Aa' }
  ];

  const fontOptions = {
    serif: [
      { name: 'Amiri', fontFamily: 'Amiri, serif' },
      { name: 'Vollkorn', fontFamily: 'Vollkorn, serif' },
      { name: 'Lora', fontFamily: 'Lora, serif' },
      { name: 'PT Serif', fontFamily: 'PT Serif, serif' },
      { name: 'Alegreya', fontFamily: 'Alegreya, serif' },
      { name: 'Aleo', fontFamily: 'Aleo, serif' },
      { name: 'Crimson Pro', fontFamily: 'Crimson Pro, serif' },
      { name: 'EB Garamond', fontFamily: 'EB Garamond, serif' },
      { name: 'Zilla Slab', fontFamily: 'Zilla Slab, serif' },
      { name: 'Cormorant Garamond', fontFamily: 'Cormorant Garamond, serif' },
      { name: 'Crimson Text', fontFamily: 'Crimson Text, serif' },
      { name: 'Source Serif Pro', fontFamily: 'Source Serif Pro, serif' }
    ],
    sans: [
      { name: 'Source Sans Pro', fontFamily: 'Source Sans Pro, sans-serif' },
      { name: 'Karla', fontFamily: 'Karla, sans-serif' },
      { name: 'Mulish', fontFamily: 'Mulish, sans-serif' },
      { name: 'Lato', fontFamily: 'Lato, sans-serif' },
      { name: 'Titillium Web', fontFamily: 'Titillium Web, sans-serif' },
      { name: 'Work Sans', fontFamily: 'Work Sans, sans-serif' },
      { name: 'Barlow', fontFamily: 'Barlow, sans-serif' },
      { name: 'Jost', fontFamily: 'Jost, sans-serif' },
      { name: 'Fira Sans', fontFamily: 'Fira Sans, sans-serif' },
      { name: 'Roboto', fontFamily: 'Roboto, sans-serif' },
      { name: 'Rubik', fontFamily: 'Rubik, sans-serif' },
      { name: 'Asap', fontFamily: 'Asap, sans-serif' },
      { name: 'Nunito', fontFamily: 'Nunito, sans-serif' },
      { name: 'Open Sans', fontFamily: 'Open Sans, sans-serif' }
    ],
    mono: [
      { name: 'Inconsolata', fontFamily: 'Inconsolata, monospace' },
      { name: 'Source Code Pro', fontFamily: 'Source Code Pro, monospace' },
      { name: 'IBM Plex Mono', fontFamily: 'IBM Plex Mono, monospace' },
      { name: 'Overpass Mono', fontFamily: 'Overpass Mono, monospace' },
      { name: 'Space Mono', fontFamily: 'Space Mono, monospace' },
      { name: 'Courier Prime', fontFamily: 'Courier Prime, monospace' }
    ]
  };

  useEffect(() => {
    const firstFont = fontOptions[selectedCategory]?.[0]?.name;
    if (firstFont && !selectedFont) {
      setSelectedFont(firstFont);
    }
  }, []);

  const handleCategoryChange = (value) => {
    if (value) {
      setSelectedCategory(value);
      const firstFont = fontOptions[value]?.[0]?.name;
      if (firstFont) {
      setSelectedFont(firstFont);
    }
    }
  };

  const handleFontSelect = (fontName) => {
    setSelectedFont(fontName);
  };

  useEffect(() => {
      setResumeMetadata(prev => ({
        ...prev,
        font: {
          ...prev.font,
          fontCategory: selectedCategory,
          fontFamily: selectedFont
        }
      }));
    }, [selectedCategory, selectedFont]);

  return (
    <div className="w-full p-6 bg-white rounded-xl">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Font</h2>

      {/* Font Category Toggle */}
      <ToggleGroup
        type="single"
        value={selectedCategory}
        onValueChange={handleCategoryChange}
        className="grid grid-cols-3 gap-2 mb-6"
      >
        {fontCategories.map((category) => (
          <ToggleGroupItem
            key={category.id}
            value={category.id}
            className="flex flex-col items-center p-3 h-auto rounded-lg data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 data-[state=on]:border-blue-300"
          >
            <span className="text-lg mb-1">{category.preview}</span>
            <span className="text-xs">{category.label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {/* Font Options */}
      <div className="grid grid-cols-3 gap-2">
        {fontOptions[selectedCategory]?.map((font) => (
          <button
            key={font.name}
            onClick={() => handleFontSelect(font.name)}
            className={`p-2 text-sm border rounded-lg transition-colors text-center flex flex-col items-center justify-center w-full h-10 overflow-hidden ${
              selectedFont === font.name
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            style={{ fontFamily: font.fontFamily }}
          >
            <span className="truncate text-xs font-medium">{font.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FontEditor;
