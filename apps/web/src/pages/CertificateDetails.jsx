import CertificationDetailCard from '@/components/CertificationDetailCard';
import ProgressIndicator from '../components/ProgressIndicator';
import StaticBar from '../components/StaticBar';

const CertificateDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <StaticBar />
            <ProgressIndicator currentStep={7}/>
            <h1 className="text-3xl font-bold text-center">Certification Details</h1>
            <span className='text-center font-semibold py-2'>"Got licenses, badges, or secret society memberships? <br />Let's show them off!"</span>
            <CertificationDetailCard/>
        </div>
    )
}

export default CertificateDetails;