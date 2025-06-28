import React, { useEffect, useState } from 'react';

const layoutIcons = {
  left: (
   <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 92 26"
    style={{ width: "55%" }}
  >
    <path
      d="M92 13c0 7.18-5.82 13-13 13s-13-5.82-13-13S71.82 0 79 0s13 5.82 13 13zM56 2H2a2 2 0 00-2 2v5a2 2 0 002 2h54a2 2 0 002-2V4a2 2 0 00-2-2zm0 13H2a2 2 0 00-2 2v5a2 2 0 002 2h54a2 2 0 002-2v-5a2 2 0 00-2-2z"
      fill="currentColor"
    />
  </svg>
  ),
  center: (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 92 56"
    style={{ width: "50%" }}
  >
    <path
      d="M88.828 34H3.172C1.42 34 0 34.895 0 36v5c0 1.105 1.42 2 3.172 2h85.656C90.58 43 92 42.105 92 41v-5c0-1.105-1.42-2-3.172-2zm0 13H3.172C1.42 47 0 47.895 0 49v5c0 1.105 1.42 2 3.172 2h85.656C90.58 56 92 55.105 92 54v-5c0-1.105-1.42-2-3.172-2zM60 13c0 7.18-5.82 13-13 13s-13-5.82-13-13S39.82 0 47 0s13 5.82 13 13z"
      fill="currentColor"
    />
  </svg>
  ),
  right: (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 92 26"
    style={{ width: "55%" }}
  >
    <path
      d="M26 13c0 7.18-5.82 13-13 13S0 20.18 0 13 5.82 0 13 0s13 5.82 13 13zM90 2H36a2 2 0 00-2 2v5a2 2 0 002 2h54a2 2 0 002-2V4a2 2 0 00-2-2zm0 13H36a2 2 0 00-2 2v5a2 2 0 002 2h54a2 2 0 002-2v-5a2 2 0 00-2-2z"
      fill="currentColor"
    />
  </svg>
  ),
};

const detailIcons = {
  single: (
    <svg width="39" height="24" viewBox="0 0 39 24" xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-auto">
      <rect width="39" height="6" rx="1"></rect>
      <rect y="9" width="39" height="6" rx="1"></rect>
      <rect y="18" width="39" height="6" rx="1"></rect>
    </svg>
  ),
  tiled: (
    <svg viewBox="0 0 82 24" xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-auto">
      <rect y="9" width="39" height="6" rx="1"></rect>
      <rect x="44" y="9" width="38" height="6" rx="1"></rect>
      <rect width="24" height="6" rx="1"></rect>
      <rect y="18" width="24" height="6" rx="1"></rect>
      <rect x="29" width="24" height="6" rx="1"></rect>
      <rect x="29" y="18" width="24" height="6" rx="1"></rect>
      <rect x="58" y="18" width="24" height="6" rx="1"></rect>
      <rect x="58" width="24" height="6" rx="1"></rect>
    </svg>
  ),
  double: (
    <svg viewBox="0 0 83 24" xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-auto">
      <rect width="39" height="6" rx="1"></rect><rect x="44" width="39" height="6" rx="1"></rect>
      <rect y="9" width="39" height="6" rx="1"></rect>
      <rect x="44" y="9" width="39" height="6" rx="1"></rect>
      <rect x="44" y="18" width="39" height="6" rx="1"></rect>
      <rect y="18" width="39" height="6" rx="1"></rect>
    </svg>
  ),
};

const infoStyles = {
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" className="mx-auto">
      <circle cx="12" cy="12" r="8" fill="#4F46E5" />
      <text x="12" y="16" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="Arial">😊</text>
    </svg>
  ),
  bullet: (
    <div className="text-sm md:text-md font-bold">• Bullet</div>
  ),
  bar: (
    <div className="text-sm md:text-md font-bold">| Bar</div>
  ),
  none: (
    <div className="text-sm md:text-md font-bold">None</div>
  ),
};

const shapeOptions = ['none', 'rounded', 'square', 'circle'];

const reorderIcons = [
  // Phone
  <svg key="phone" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6.6 10.8a16.9 16.9 0 0 0 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3 1.3.4 2.7.6 4.1.6.7 0 1.3.6 1.3 1.3v3.6c0 .7-.6 1.3-1.3 1.3C10.5 22 2 13.5 2 3.3 2 2.6 2.6 2 3.3 2h3.6c.7 0 1.3.6 1.3 1.3 0 1.4.2 2.8.6 4.1.1.4 0 .9-.3 1.2L6.6 10.8z" />
  </svg>,
  // Mail
  <svg key="mail" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v1l-10 6L2 7V6c0-1.1.9-2 2-2zm0 4.5l8 4.5 8-4.5V18c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V8.5z" />
  </svg>,
  // Location
  <svg key="location" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z" />
  </svg>,
  // GitHub
  <svg key="github" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1.8 1.4 2.3 1.4 1.3.1 2.7-.1 3.4-.3v-1.9c-2.6.5-3.5-1.2-3.5-1.2-.5-1-.7-1.7-.7-1.7-.5-1.1.3-.8.3-.8 1.1.1 1.7 1.1 1.7 1.1 1.1.3 2.3.3 3.4.2v-1.8c.1-.9.5-1.5.9-1.8-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1.1-2.8-.1-.2-.5-1.3.1-2.7 0 0 .9-.3 2.8 1.1.8-.2 1.6-.3 2.4-.3s1.6.1 2.4.3c1.8-1.4 2.8-1.1 2.8-1.1.6 1.4.2 2.5.1 2.7.7.8 1.1 1.7 1.1 2.8 0 3.9-2.4 4.6-4.6 5 .5.4.9 1.2.9 2.4v3.5c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
  </svg>,
  // Calendar
  <svg key="calendar" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v2h18V6c0-1.1-.9-2-2-2zM3 20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V10H3v10z" />
  </svg>,
  // Flag
  <svg key="flag" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4 2v20h2v-7h12l-1.5-5L18 3H6V2H4z" />
  </svg>,
];

export default function HeaderEditor({resumeMetadata, setResumeMetadata}) {
  const [layout, setLayout] = useState(resumeMetadata?.header?.headerType || 'left');
  const [detail, setDetail] = useState(resumeMetadata?.header?.detail || 'tiled');
  const [infoStyle, setInfoStyle] = useState(resumeMetadata?.header?.infoStyle || 'icon');
  const [shape, setShape] = useState(resumeMetadata?.header?.iconShape || 'None');

  useEffect(() => {
    setResumeMetadata(prev => ({
      ...prev,
      header: {
        ...prev.header,
        headerType: layout,
        detail: detail,
        infoStyle: infoStyle,
        iconShape: shape,
    }
    })
    )
  }, [layout, detail, infoStyle, shape])

  return (
    <div className="p-6 w-full mx-auto bg-white rounded-xl shadow space-y-6">
      <h2 className="text-xl font-bold text-zinc-900">Header</h2>

      {/* Layout */}
      <div className="flex gap-4 w-full">
        {Object.entries(layoutIcons).map(([id, svg]) => (
          <button
            key={id}
            onClick={() => {
              setLayout(id)
              setDetail('tiled')
            }}
            className={`rounded-lg flex justify-center p-2 border w-full  ${
              layout === id ? 'border-indigo-500 bg-indigo-50' : 'border-zinc-300'
            }`}
          >
            {svg}
          </button>
        ))}
      </div>

      {/* Details */}
      <div className="text-sm font-semibold text-zinc-700">Details</div>
        <div className="flex gap-4">
          {Object.entries(detailIcons)
            .filter(([id]) =>
              layout === 'center' ? ['tiled', 'double'].includes(id) : true
            )
            .map(([id, svg]) => (
              <button
                key={id}
                onClick={() => setDetail(id)}
                className={`rounded-lg flex justify-center p-2 border w-full ${
                  detail === id ? 'border-indigo-500 bg-indigo-50' : 'border-zinc-300'
                }`}
              >
                {svg}
              </button>
            ))}
        </div>


      {/* Info Style */}
      <div className="text-sm font-semibold text-zinc-700">Info Style</div>
      <div className="flex gap-4">
        {Object.entries(infoStyles)
          .filter(([id]) =>
            detail === 'tiled'
              ? ['icon', 'bullet', 'bar'].includes(id)
              : ['icon', 'none'].includes(id)
          )
          .map(([id, label]) => (
            <button
              key={id}
              onClick={() => setInfoStyle(id)}
              className={`flex-1 py-2 border rounded-lg text-center ${
                infoStyle === id ? 'border-indigo-500 bg-indigo-50' : 'border-zinc-300'
              }`}
            >
              {label}
            </button>
          ))}
      </div>


      {/* Shape */}
      {infoStyle === 'icon' && (
        <>
          <div className="text-sm font-semibold text-zinc-700">Shape</div>
          <div className="flex gap-4">
            {shapeOptions.map(s => (
              <button
                key={s}
                onClick={() => setShape(s)}
                className={`flex-1 py-2 border rounded-lg text-center ${
                  shape === s ? 'border-indigo-500 bg-indigo-50' : 'border-zinc-300'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Change Order */}
      <div className="text-sm font-semibold text-zinc-700">Change Order</div>
      <div className="flex gap-2">
        {reorderIcons.map((icon, idx) => (
          <div
            key={idx}
            className="w-9 h-9 flex items-center justify-center bg-zinc-100 rounded-full text-zinc-600"
          >
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
}
