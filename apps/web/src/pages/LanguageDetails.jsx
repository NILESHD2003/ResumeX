import LanguageDetailsCard from '@/components/LanguageDetailCard';
import ProgressIndicator from '../components/ProgressIndicator';

const LanguageDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <ProgressIndicator currentStep={6}/>
            <LanguageDetailsCard/>
        </div>
    )
}

export default LanguageDetails;