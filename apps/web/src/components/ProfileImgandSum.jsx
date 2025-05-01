import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card } from './ui/card'

const ProfileImgandSum = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [summary, setSummary] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      console.log(file)
    }
  };

  const handleSummaryChange = (event) => {
    setSummary(event.target.value);
    console.log(summary);
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start w-full">
        <div className="flex flex-col items-center space-y-4 w-full md:w-auto">
            <div className="relative w-32 h-32 rounded-2xl bg-gray-100 overflow-hidden">
            {imagePreview ? (
                <img
                src={imagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                Profile Pic
                </div>
            )}
            </div>
            <div>
            <input
                type="file"
                id="profile-upload"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
            />
            <label htmlFor="profile-upload">
                <Button
                variant="outline"
                className="rounded-full bg-blue-500 hover:bg-blue-600 text-white border-none"
                size="sm"
                asChild
                >
                <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Image
                </span>
                </Button>
            </label>
            </div>
        </div>

        <div className="w-full">
            <Label htmlFor="profile-summary" className="text-muted-foreground mb-2 block">
            Profile Summary
            </Label>
            <Textarea
            id="profile-summary"
            placeholder="Write a brief summary about yourself..."
            className="min-h-[120px] resize-none rounded-2xl"
            value={summary}
            onChange={handleSummaryChange}
            />
        </div>
        </div>
    </Card>
  );
};

export default ProfileImgandSum;