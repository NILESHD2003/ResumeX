import OrganizationDetailCard from '@/components/OrganizationCardDetails';
import ProgressIndicator from '../components/ProgressIndicator';

const OrganizationDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <ProgressIndicator currentStep={11}/>
            <OrganizationDetailCard/>
        </div>
    )
}

export default OrganizationDetails;