import OrganizationDetailCard from '@/components/OrganizationCardDetails';
import ProgressIndicator from '../components/ProgressIndicator';
import StaticBar from '../components/StaticBar';

const OrganizationDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <StaticBar />
            <ProgressIndicator currentStep={11}/>
            <h1 className="text-3xl font-bold text-center">Organization Details</h1>
            <span className='text-center font-semibold py-2'>"Doing good? Being awesome? <br />Your volunteering moments belong right here!"</span>
            <OrganizationDetailCard/>
        </div>
    )
}

export default OrganizationDetails;