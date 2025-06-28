import React, { useState, useEffect } from 'react';

const CertificatesEditor = ({resumeMetadata, setResumeMetadata}) => {
  const [selectedLayout, setSelectedLayout] = useState(resumeMetadata?.certificates?.layout || 'grid');
  const [selectedSubinfoStyle, setSelectedSubinfoStyle] = useState(resumeMetadata?.certificates?.subInfoStyle || 'none');
  const [selectedLayoutStyle, setSelectedLayoutStyle] = useState(resumeMetadata?.certificates?.layoutInfo || 'two-column');


  useEffect(() => {
      setResumeMetadata(prev => ({
        ...prev,
        certificates: {
          ...prev.certificates,
          layout: selectedLayout,
          layoutInfo: selectedLayoutStyle,
          subInfoStyle: selectedSubinfoStyle
        }
      }));
    }, [selectedLayout, selectedSubinfoStyle, selectedLayoutStyle]);

  const layoutOptions = [
    { id: 'grid', label: 'Grid' },
    { id: 'compact', label: 'Compact' },
    { id: 'bubble', label: 'Bubble' }
  ];

  const gridStyleOptions = [
    { id: 'grid-cols-1', label: '1 Column' },
    { id: 'grid-cols-2', label: '2 Columns' },
    { id: 'grid-cols-3', label: '3 Columns' },
    { id: 'grid-cols-4', label: '4 Columns' }
  ];

  const compactStyleOptions = [
    { id: 'bullet', label: 'Bullet' },
    { id: 'pipe', label: 'Pipe' },
    { id: 'newline', label: 'New Line' },
    { id: 'comma', label: 'Comma' }
  ];

  const subinfoStyleOptions = [
    { id: 'dash', label: '– Dash' },
    { id: 'colon', label: ': Colon' },
    { id: 'bracket', label: '() Bracket' }
  ];

  const handleLayoutStyleSet = (layout) => {
    switch (layout) {
      case 'grid':
        setSelectedLayoutStyle('grid-cols-2');
        break;
      case 'compact':
        setSelectedLayoutStyle('bullet');
        break;
      case 'bubble':
        setSelectedLayoutStyle('none');
        break;
      default:
        setSelectedLayoutStyle('');
    }
  };

  const handleLayoutSelect = (layout) => {
    setSelectedLayout(layout);
    handleLayoutStyleSet(layout);

    if (layout === 'grid') {
      setSelectedSubinfoStyle('none');
    } else {
      setSelectedSubinfoStyle(subinfoStyleOptions[0].id);
    }

    console.log('Selected layout:', layout);
  };

  const handleSubinfoStyleSelect = (style) => {
    setSelectedSubinfoStyle(style);
    console.log('Selected subinfo style:', style);
  };

   const renderGridIcon = (gridStyle) => {
    switch (gridStyle) {
      case 'grid-cols-1':
        return (
          <svg width="24" height="16" fill='none'>
            <rect width="24" height="16" fill="currentColor" stroke="currentColor"rx="1" />
          </svg>
        );
      case 'grid-cols-2':
        return (
          <div className="grid grid-cols-2 gap-x-[2px]">
            <svg width="11" height="16" fill='none'>
              <rect width="11" height="16" fill="currentColor" stroke="currentColor" rx="1" />
            </svg>
            <svg width="11" height="16" fill='none'>
              <rect width="11" height="16" fill="currentColor" stroke="currentColor" rx="1" />
            </svg>
          </div>
        );
      case 'grid-cols-3':
        return (
          <div className="grid grid-cols-3 gap-x-[2px]">
            {[...Array(3)].map((_, i) => (
              <svg key={i} width="7" height="16" fill='none'>
                <rect width="7" height="16" fill="currentColor" stroke="currentColor" rx="1" />
              </svg>
            ))}
          </div>
        );
      case 'grid-cols-4':
        return (
          <div className="grid grid-cols-4 gap-x-[2px]">
            {[...Array(4)].map((_, i) => (
              <svg key={i} width="5" height="16" fill='none'>
                <rect width="5" height="16" rx="1" fill="currentColor" stroke="currentColor"/>
              </svg>
            ))}
          </div>
        );
      default:
        return null;
    }
  };


  const showGridStyles = selectedLayout === 'grid';
  const showCompactStyles = selectedLayout === 'compact';
  const showSubinfoStyles = selectedLayout === 'compact' || selectedLayout === 'bubble';

  return (
    <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Certifcates</h2>

      {/* Layout Selection */}
      <div className="mb-6">
        <div className="grid grid-cols-4 gap-2">
          {layoutOptions.map((layout) => (
            <button
              key={layout.id}
              onClick={() => handleLayoutSelect(layout.id)}
              className={`p-3 rounded-lg border transition-colors ${
                selectedLayout === layout.id
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs">{layout.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Grid Style Options */}
      {showGridStyles && (
        <div className="mb-6">
          <div className="grid grid-cols-4 gap-2">
            {gridStyleOptions.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedLayoutStyle(style.id)}
                className={`h-[56px] p-2 rounded-lg border transition-colors flex items-center justify-center ${
                  selectedLayoutStyle === style.id
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center h-full">
                  {renderGridIcon(style.id)}
                </div>
            </button>
            ))}
          </div>
        </div>
      )}

      {/* Compact Style Options */}
      {showCompactStyles && (
        <div className="mb-6">
          <div className="grid grid-cols-4 gap-2">
            {compactStyleOptions.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedLayoutStyle(style.id)}
                className={`p-3 text-xs rounded-lg border transition-colors ${
                  selectedLayoutStyle === style.id
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Subinfo Style Options */}
      {showSubinfoStyles && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Subinfo Style</h3>
          <div className="grid grid-cols-3 gap-2">
            {subinfoStyleOptions.map((style) => (
              <button
                key={style.id}
                onClick={() => handleSubinfoStyleSelect(style.id)}
                className={`p-3 text-xs rounded-lg border transition-colors ${
                  selectedSubinfoStyle === style.id
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesEditor;
