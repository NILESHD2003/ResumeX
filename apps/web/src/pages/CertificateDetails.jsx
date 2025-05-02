import CertificationDetailCard from '@/components/CertificationDetailCard';
import ProgressIndicator from '../components/ProgressIndicator';

const CertificateDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <ProgressIndicator currentStep={7}/>
            <CertificationDetailCard/>
        </div>
    )
}

export default CertificateDetails;