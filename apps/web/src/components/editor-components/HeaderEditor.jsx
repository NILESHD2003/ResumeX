import React, { useState } from 'react';

const layoutIcons = {
  left: (
    <svg width="140" height="24" viewBox="0 0 40 24">
      <rect x="6" y="6" width="20" height="3" rx="1.5" />
      <circle cx="35" cy="10" r="8"/>
      <rect x="6" y="13" width="20" height="3" rx="1" />
    </svg>
  ),
  center: (
    <svg width="40" height="24" viewBox="0 0 40 24">
      <circle cx="20" cy="6" r="3" fill="#4F46E5" />
      <rect x="10" y="12" width="20" height="3" rx="1.5" fill="#4F46E5" />
      <rect x="14" y="17" width="12" height="2" rx="1" fill="#A5B4FC" />
    </svg>
  ),
  right: (
    <svg width="40" height="24" viewBox="0 0 40 24">
      <circle cx="10" cy="7.5" r="3" fill="#4F46E5" />
      <rect x="14" y="6" width="20" height="3" rx="1.5" fill="#4F46E5" />
      <rect x="22" y="13" width="12" height="2" rx="1" fill="#A5B4FC" />
    </svg>
  ),
};

const detailIcons = {
  left: (
    <svg width="40" height="20" viewBox="0 0 40 20">
      <rect x="6" y="6" width="16" height="2" fill="#999" />
      <rect x="6" y="11" width="12" height="2" fill="#999" />
    </svg>
  ),
  center: (
    <svg width="40" height="20" viewBox="0 0 40 20">
      <rect x="8" y="5" width="24" height="2" fill="#4F46E5" />
      <rect x="8" y="9" width="24" height="2" fill="#4F46E5" />
      <rect x="8" y="13" width="24" height="2" fill="#4F46E5" />
    </svg>
  ),
  right: (
    <svg width="40" height="20" viewBox="0 0 40 20">
      <rect x="18" y="6" width="16" height="2" fill="#999" />
      <rect x="22" y="11" width="12" height="2" fill="#999" />
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
    <div className="text-lg text-indigo-600 font-bold">• Bullet</div>
  ),
  bar: (
    <div className="text-lg text-indigo-600 font-bold">| Bar</div>
  ),
};

const shapeOptions = ['None', 'Rounded', 'Square', 'Circle'];

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

export default function HeaderSettingsPanel() {
  const [layout, setLayout] = useState('left');
  const [detail, setDetail] = useState('center');
  const [infoStyle, setInfoStyle] = useState('icon');
  const [shape, setShape] = useState('None');

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow space-y-6">
      <h2 className="text-xl font-bold text-zinc-900">Header</h2>

      {/* Layout */}
      <div className="flex gap-4 w-full">
        {Object.entries(layoutIcons).map(([id, svg]) => (
          <button
            key={id}
            onClick={() => setLayout(id)}
            className={`rounded-lg p-2 border w-full ${
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
        {Object.entries(detailIcons).map(([id, svg]) => (
          <button
            key={id}
            onClick={() => setDetail(id)}
            className={`rounded-lg p-2 border ${
              detail === id ? 'border-indigo-500 bg-indigo-50' : 'border-zinc-300'
            }`}
          >
            {svg}
          </button>
        ))}
      </div>

      {/* Info Style */}
      <div className="flex gap-4">
        {Object.entries(infoStyles).map(([id, label]) => (
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
            {s}
          </button>
        ))}
      </div>

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
