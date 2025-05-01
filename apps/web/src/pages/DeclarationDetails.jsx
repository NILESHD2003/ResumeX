import DeclarationCard from '@/components/DeclarationCard';
import ProgressIndicator from '../components/ProgressIndicator';

const DeclarationDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <ProgressIndicator currentStep={14}/>
            <DeclarationCard/>
        </div>
    )
}

export default DeclarationDetails;