import AwardDetailsCard from '@/components/AwardDetailsCard';
import ProgressIndicator from '../components/ProgressIndicator';

const AwardDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <ProgressIndicator currentStep={9}/>
            <AwardDetailsCard/>
        </div>
    )
}

export default AwardDetails;