import ReferenceDetailCard from '@/components/ReferenceDetailCards';
import ProgressIndicator from '../components/ProgressIndicator';

const ReferenceDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-[#F1F0FB]'>
            <ProgressIndicator currentStep={13}/>
            <ReferenceDetailCard/>
        </div>
    )
}

export default ReferenceDetails;