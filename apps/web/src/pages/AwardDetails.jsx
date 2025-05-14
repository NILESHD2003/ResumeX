import AwardDetailsCard from '@/components/AwardDetailsCard';
import ProgressIndicator from '../components/ProgressIndicator';
import StaticBar from '../components/StaticBar';

const AwardDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <StaticBar />
            <ProgressIndicator currentStep={9}/>
            <h1 className="text-3xl font-bold text-center">Award Details</h1>
            <span className='text-center font-semibold py-2'>"You earned them, now it's time to brag <br />— no humblebragging needed!"</span>
            <AwardDetailsCard/>
        </div>
    )
}

export default AwardDetails;