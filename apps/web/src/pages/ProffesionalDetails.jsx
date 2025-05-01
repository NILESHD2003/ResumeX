import ProffesionalCard from '@/components/ProffesionalDetail';
import ProgressIndicator from '../components/ProgressIndicator';

const ProffesionalDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center  bg-[#F1F0FB]'>
            <ProgressIndicator currentStep={4}/>
            <ProffesionalCard/>
        </div>
    )
}

export default ProffesionalDetails;