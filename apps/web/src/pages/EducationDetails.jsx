import EducationCard from '@/components/EducationDetailCard';
import ProgressIndicator from '../components/ProgressIndicator';

const EducationDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <ProgressIndicator currentStep={3}/>
            <EducationCard/>
        </div>
    )
}

export default EducationDetails;