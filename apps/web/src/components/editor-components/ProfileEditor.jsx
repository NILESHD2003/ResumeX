import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

const ProfileEditor = ({resumeMetadata, setResumeMetadata}) => {
  const [showProfileSectionHeading, setShowProfileSectionHeading] = useState(resumeMetadata?.profile?.showHeading || true);

  useEffect(() => {
    setResumeMetadata(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          showHeading: showProfileSectionHeading
        }
      }));
    }, [showProfileSectionHeading]);

  return (
    <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile</h2>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="show-profile-section-heading"
          checked={showProfileSectionHeading}
          onCheckedChange={(checked) => setShowProfileSectionHeading(!!checked)}
        />
        <label htmlFor="show-profile-section-heading" className="text-sm text-gray-700">
          Show profile section heading
        </label>
      </div>
    </div>
  );
};

export default ProfileEditor;
