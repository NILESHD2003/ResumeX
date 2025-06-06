import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from "@/components/ui/button";


const NameEditor = () => {
  const [selectedSize, setSelectedSize] = useState('XL');
  const [isNameBold, setIsNameBold] = useState(true);
  const [selectedFontCategory, setSelectedFontCategory] = useState('body');
  const [selectedFont, setSelectedFont] = useState('');

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];

  const fontCategories = [
    { id: 'body', label: 'Body Font' },
    { id: 'creative', label: 'Creative' }
  ];

  const creativeFont = [
    'Abril Fatface',
    'AMATIC SC',
    'Bungee Shade',
    'Caveat',
    'Caveat Brush',
    'Comfortaa',
    'Elsie',
    'Lobster',
    'Pacifico',
    'Pressorro',
    'Vibes'
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

  return (
    <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-sm mx-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Name</h2>

      {/* Size Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
            {sizeOptions.map((size) => (
                <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSize(size)}
                >
                {size}
                </Button>
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
          <label
            htmlFor="name-bold"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Name bold
          </label>
        </div>
      </div>

      {/* Font Category Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Font</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
            {fontCategories.map((category) => (
                <Button
                key={category.id}
                variant={selectedFontCategory === category.id ? "default" : "outline"}
                onClick={() => {
                    setSelectedFontCategory(category.id);
                    if (category.id === "creative") {
                    setSelectedFont(creativeFont[0]);
                    } else {
                    setSelectedFont('');
                    }
                }}
                >
                {category.label}
                </Button>
            ))}
        </div>


        {/* Only show font options when creative is selected */}
        {selectedFontCategory === "creative" && (
            <div className="grid grid-cols-3 gap-3">
                {creativeFont.map((font) => (
                <Button
                    key={font}
                    variant={selectedFont === font ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFont(font)}
                    style={{
                    fontFamily: getFontStyle(font)
                    }}
                >
                    {font}
                </Button>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default NameEditor;
