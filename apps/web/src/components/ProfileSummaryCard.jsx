import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { getProfileSummaryDetails, updateProfileSummaryDetails } from '../services/operations/profileSummaryAPI';

const ProfileSummaryCard = () => {
  const [summary, setSummary] = useState('');
  const [hide, setHide] = useState(false);

  async function fetchFilledDetails() {
    const data = await getProfileSummaryDetails();
    setSummary(data.summary || '');
    setHide(data.hide || false);
  }

  const handleSummaryChange = (event) => {
    setSummary(event.target.value);
    console.log(event.target.value);
  };

  const handleSummarySubmit = (e) => {
    e.preventDefault();

    updateProfileSummaryDetails(summary);
    console.log(summary);
  };

  const toggleHide = () => {
    setHide((prev) => !prev);
  };

  useEffect(() => {
    fetchFilledDetails();
  }, []);

  return (
    <form onSubmit={handleSummarySubmit} className="w-full px-4">
      <Card className="w-full max-w-xl sm:max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-sm">
        <div className="flex flex-col gap-6 items-start w-full">
          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="profile-summary" className="text-muted-foreground">
                Profile Summary
              </Label>
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="text-xs px-3 py-1 rounded-full"
                onClick={toggleHide}
              >
                {hide ? 'Show' : 'Hide'}
              </Button>
            </div>
            {!hide && (
              <Textarea
                id="profile-summary"
                placeholder="Write a brief summary about yourself..."
                className="h-32 resize-none w-full rounded-2xl"
                value={summary}
                onChange={handleSummaryChange}
              />
            )}
          </div>
          <Button type="submit" className="rounded-full">
            Submit
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default ProfileSummaryCard;
