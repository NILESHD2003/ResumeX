import PersonalDetailsForm from '@/components/PersonalDetailsCard';
import ProgressIndicator from '../components/ProgressIndicator';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PersonalDetails = () => {
    const navigate = useNavigate();
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <ProgressIndicator currentStep={1}/>
            <h1 className="text-3xl font-bold text-center py-2">Personal Details</h1>
            <span className='text-center font-light py-2'>This is a subtitle</span>
            <PersonalDetailsForm/>
            <div className='w-full max-w-4xl px-4 mx-auto mt-10 mb-6 flex justify-between'>
                <div></div>
                <Button onClick={() => navigate('/onboarding/profile-image')} className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded'>
                    Continue
                </Button>
            </div>
        </div>
    )
}

export default PersonalDetails;