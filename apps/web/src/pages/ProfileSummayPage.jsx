import ProfileSummaryCard from '@/components/ProfileSummaryCard';
import ProgressIndicator from '../components/ProgressIndicator';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ProfileSummaryPage = () => {
    const navigate = useNavigate();
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <ProgressIndicator currentStep={3}/>
            <ProfileSummaryCard/>
            <div className='w-full max-w-4xl px-4 mx-auto mt-10 mb-6 flex justify-between'>
                <Button onClick={() => navigate('/onboarding/profile-image')} className='bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-6 rounded'>
                    Back
                </Button>
                <Button onClick={() => navigate('/onboarding/education-section')} className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded'>
                    Continue
                </Button>
            </div>
        </div>
    )
}

export default ProfileSummaryPage;