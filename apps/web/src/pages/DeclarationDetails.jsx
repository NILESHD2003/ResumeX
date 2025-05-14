import DeclarationCard from '@/components/DeclarationCard';
import ProgressIndicator from '../components/ProgressIndicator';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import StaticBar from '../components/StaticBar';

const DeclarationDetails = () => {
    const navigate = useNavigate()
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <StaticBar />
            <ProgressIndicator currentStep={14}/>
            <h1 className="text-3xl font-bold text-center">Declaration</h1>
            <span className='text-center font-semibold py-2'>"A promise sealed with your signature <br />— short, sweet, and sincere."</span>
            <DeclarationCard/>
            <div className='w-full max-w-4xl px-4 mx-auto mt-10 mb-6 flex justify-between'>
                <Button variant="outline" onClick={() => navigate('/onboarding/references-section')} className='font-semibold py-2 px-6 rounded'>
                    Back
                </Button>
                <Button onClick={() => navigate('/onboarding/preview')} className='font-semibold py-2 px-6 rounded'>
                    Complete
                </Button>
            </div>
        </div>
    )
}

export default DeclarationDetails;