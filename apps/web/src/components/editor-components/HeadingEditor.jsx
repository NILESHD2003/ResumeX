import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const HeadingEditor = () => {
  const [selectedStyle, setSelectedStyle] = useState('underline');
  const [selectedCapitalization, setSelectedCapitalization] = useState('capitalize');
  const [selectedSize, setSelectedSize] = useState('xl');
  const [selectedIcon, setSelectedIcon] = useState('none');

  const headingStyles = [
    {
      id: 'underline',
      preview: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 137 49" className="w-full h-auto">
          <rect width="48" height="9" x="20" y="16" rx="1" stroke="currentColor"></rect>
          <path strokeLinejoin="round" strokeWidth="2" d="M20 32L68 32" stroke="currentColor"></path>
        </svg>
      )
    },
    {
      id: 'box',
      preview: (
        <svg viewBox="0 0 137 49" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M29 35h79M108 14v21M29 13.92h79M29 14v20.5" stroke="currentColor"></path>
          <rect width="48" height="9" x="45" y="20" rx="1" stroke="currentColor"></rect>
        </svg>
      )
    },
    {
      id: 'simple',
      preview: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 137 49" className="w-full h-auto">
          <rect width="44" height="9" x="20" y="20" rx="1" stroke="currentColor"></rect>
        </svg>
      )
    },
    {
      id: 'topBottomLine',
      preview: (
        <svg viewBox="0 0 137 49" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <line x1="27" y1="35" x2="110" y2="35" strokeWidth="2" strokeLinejoin="round" stroke="currentColor"></line>
          <line x1="27" y1="14" x2="110" y2="14" strokeWidth="2" strokeLinejoin="round" stroke="currentColor"></line>
          <rect x="46" y="20" width="44" height="9" rx="1" stroke="currentColor"></rect>
        </svg>
      )
    },
    {
      id: 'line',
      preview: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 137 49" className="w-full h-auto">
          <path strokeLinejoin="round" strokeWidth="2" d="M20 33L100 33" stroke="currentColor"></path>
          <rect width="44" height="9" x="20" y="16" rx="1" stroke="currentColor"></rect>
        </svg>
      )
    },
    {
      id: 'thickShortUnderline',
      preview: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 137 49" className="w-full h-auto">
          <rect width="48" height="9" x="20.015" y="15" rx="1" stroke="currentColor"></rect>
          <path strokeWidth="4" d="M20 32.5L37.029 32.5" stroke="currentColor"></path>
        </svg>
      )
    },
    {
      id: 'zigZagLine',
      preview: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 49" className="w-full h-auto">
          <rect width="44" height="9" x="20" y="16" rx="1" stroke="currentColor"></rect>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 .74667 -.66519 -.74667 61.693 31)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="scale(-.94072 -1.05596) rotate(45 8.214 -93.334)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 .74667 -.66519 -.74667 56.17 31)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 -.74667 .66519 -.74667 54.388 35)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 .74667 -.66519 -.74667 50.824 31)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="scale(-.94072 -1.05596) rotate(45 13.99 -79.388)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 .74667 -.66519 -.74667 45.3 31)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="scale(-.94072 -1.05596) rotate(45 16.88 -72.415)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 .74667 -.66519 -.74667 39.956 31)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 -.74667 .66519 -.74667 38.085 35)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 .74667 -.66519 -.74667 34.432 31)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 -.74667 .66519 -.74667 32.65 35)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 .74667 -.66519 -.74667 29.087 31)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 -.74667 .66519 -.74667 27.216 35)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 .74667 -.66519 -.74667 23.564 31)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 .74667 -.66519 -.74667 100 31)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 -.74667 .66519 -.74667 98.13 35)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 .74667 -.66519 -.74667 94.477 31)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 -.74667 .66519 -.74667 92.695 35)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 .74667 -.66519 -.74667 89.131 31)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 -.74667 .66519 -.74667 87.26 35)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 .74667 -.66519 -.74667 83.608 31)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 -.74667 .66519 -.74667 81.826 35)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 .74667 -.66519 -.74667 78.263 31)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 -.74667 .66519 -.74667 76.392 35)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 .74667 -.66519 -.74667 72.74 31)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 -.74667 .66519 -.74667 70.958 35)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="scale(-.94072 -1.05596) rotate(-45 -71.258 71.8)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="scale(-.94072 -1.05596) rotate(45 5.184 -100.65)" stroke="currentColor"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M0.75 -0.75L4.607 -0.75" transform="matrix(-.66519 .74667 -.66519 -.74667 61.87 31)" stroke="currentColor"></path>
        </svg>
      )
    }
  ];

  const capitalizationOptions = [
    { id: 'capitalize', label: 'Capitalize' },
    { id: 'uppercase', label: 'Uppercase' }
  ];

  const sizeOptions = [
    { id: 's', label: 'S' },
    { id: 'm', label: 'M' },
    { id: 'l', label: 'L' },
    { id: 'xl', label: 'XL' }
  ];

  const iconOptions = [
    { id: 'none', label: 'None' },
    { id: 'outline', label: 'Outline' },
    { id: 'filled', label: 'Filled' }
  ];

  const handleStyleChange = (styleId) => {
    if (styleId) setSelectedStyle(styleId);
  };

  const sectionTitleClass = "text-sm font-medium text-gray-700 mb-3";

  const buttonClass = (id) =>
    `h-14 flex items-center justify-center rounded-xl border transition-all duration-150 ease-in-out
    ${selectedStyle === id
      ? "border-blue-500 ring-2 ring-blue-300 bg-blue-50"
      : "border-gray-300 hover:bg-gray-50 bg-white"
    }`;

  return (
    <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Heading</h2>

      {/* Style Section */}
      <div className="mb-6">
        <h3 className={sectionTitleClass}>Style</h3>
        <div className="grid grid-cols-4  w-full gap-3">
          {headingStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => handleStyleChange(style.id)}
              className={buttonClass(style.id)}
              aria-pressed={selectedStyle === style.id}
            >
              {style.preview}
            </button>
          ))}
        </div>
      </div>

      {/* Capitalization */}
      <div className="mb-6">
        <h3 className={sectionTitleClass}>Capitalization</h3>
        <ToggleGroup
          type="single"
          value={selectedCapitalization}
          onValueChange={setSelectedCapitalization}
          className="grid grid-cols-3 gap-2 w-full"
        >
          {capitalizationOptions.map(option => (
            <ToggleGroupItem
              key={option.id}
              value={option.id}
              className="h-10 rounded-md border w-full text-sm font-medium transition-colors
              data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 data-[state=on]:border-blue-300"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Size */}
      <div className="mb-6">
        <h3 className={sectionTitleClass}>Size</h3>
        <ToggleGroup
          type="single"
          value={selectedSize}
          onValueChange={setSelectedSize}
          className="grid grid-cols-4 gap-2"
        >
          {sizeOptions.map(option => (
            <ToggleGroupItem
              key={option.id}
              value={option.id}
              className="size-10 rounded-md border text-sm font-medium transition-colors
              data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 data-[state=on]:border-blue-300"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Icons */}
      <div>
        <h3 className={sectionTitleClass}>Icons</h3>
        <ToggleGroup
          type="single"
          value={selectedIcon}
          onValueChange={setSelectedIcon}
          className="grid grid-cols-3 gap-2 w-full"
        >
          {iconOptions.map(option => (
            <ToggleGroupItem
              key={option.id}
              value={option.id}
              className="h-10 w-full rounded-md border text-sm font-medium transition-colors
              data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 data-[state=on]:border-blue-300"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
};

export default HeadingEditor;
