import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

const FooterEditor = ({resumeMetadata, setResumeMetadata}) => {
  const [pageNumbers, setPageNumbers] = useState(resumeMetadata?.footer?.pageNo || false);
  const [email, setEmail] = useState(resumeMetadata?.footer?.email || false);
  const [name, setName] = useState(resumeMetadata?.footer?.name || false);

  useEffect(() => {
          setResumeMetadata(prev => ({
            ...prev,
            footer: {
              ...prev.footer,
              pageNo: pageNumbers,
              email: email,
              name: name
            }
          }));
        }, [pageNumbers, email, name]);

  return (
    <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Footer</h2>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="page-numbers"
            checked={pageNumbers}
            onCheckedChange={(checked) => setPageNumbers(!!checked)}
          />
          <label htmlFor="page-numbers" className="text-sm text-gray-700">
            Page numbers
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="email"
            checked={email}
            onCheckedChange={(checked) => setEmail(!!checked)}
          />
          <label htmlFor="email" className="text-sm text-gray-700">
            Email
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="name"
            checked={name}
            onCheckedChange={(checked) => setName(!!checked)}
          />
          <label htmlFor="name" className="text-sm text-gray-700">
            Name
          </label>
        </div>
      </div>
    </div>
  );
};

export default FooterEditor;
