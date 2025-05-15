import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { getProfileSummaryDetails, updateProfileSummaryDetails } from '../services/operations/profileSummaryAPI';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';


const ProfileSummaryCard = () => {
  const [summary, setSummary] = useState('');
  const [original, setOriginal] = useState('');
  const navigate = useNavigate()

  async function fetchFilledDetails() {
    const data = await getProfileSummaryDetails();
    setSummary(data.summary || '');
    setOriginal(data.summary || '');
  }

  const handleSummaryChange = (event) => {
    setSummary(event.target.value);
    console.log(event.target.value);
  };

  const handleSummarySubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("Working")
      if (summary !== original) {
        await updateProfileSummaryDetails(summary);
        toast.success("Submitted succesfully");
        navigate('/onboarding/education-section');
      } else {
        navigate('/onboarding/education-section');
      }
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    fetchFilledDetails();
  }, []);

  return (
    <div className='flex flex-col w-full'>
      <Toaster />
    <form onSubmit={handleSummarySubmit} className="w-full px-4">
      <Card className="w-full max-w-xl mx-auto p-6 bg-white rounded-3xl shadow-sm">
        <div className="flex flex-col gap-6 items-start w-full">
          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="profile-summary" className="text-muted-foreground">
                Profile Summary
              </Label>
            </div>
              <Textarea
                id="profile-summary"
                placeholder="Write a brief summary about yourself..."
                className="h-32 resize-none w-full rounded-2xl"
                value={summary}
                onChange={handleSummaryChange}
              />
          </div>
        </div>
      </Card>
      <div className='w-full max-w-4xl px-4 mx-auto mt-10 mb-6 flex justify-between'>
          <Button variant="outline" type='button' onClick={() => navigate('/onboarding/personal-details')} className='font-semibold py-2 px-6 rounded'>
              Back
          </Button>
          {(summary !== original) ? (
            <Button type='submit' className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded'>
                Continue
            </Button>
          ) : (
            <Button type='button' onClick={() => navigate('/onboarding/education-section')} className='font-semibold py-2 px-6 rounded'>
                Skip
            </Button>
          )}
      </div>
    </form>
    </div>
  );
};

export default ProfileSummaryCard;
