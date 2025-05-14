import React, { useState } from 'react';
import { Card } from './ui/card';

const ProfileImageCard = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full md:w-auto">
      <input
        type="file"
        id="profile-upload"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      <label htmlFor="profile-upload" className="cursor-pointer">
        <div className="relative size-32 rounded-2xl bg-gray-100 overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-400 transition">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm text-center px-2">
              Click to Upload
            </div>
          )}
        </div>
      </label>
    </div>
  );
};

export default ProfileImageCard;
