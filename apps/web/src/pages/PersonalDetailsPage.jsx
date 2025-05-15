import PersonalDetailsForm from '@/components/PersonalDetailsCard';
import ProgressIndicator from '../components/ProgressIndicator';
import StaticBar from '../components/StaticBar';

const PersonalDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <StaticBar />
            <ProgressIndicator currentStep={1}/>
            <h1 className="text-3xl font-bold text-center py-2">Personal Details</h1>
            <span className='text-center font-semibold py-2'>"Start strong! Tell the world who you are <br /> — charming, bold, and unforgettable."</span>
            <PersonalDetailsForm/>
        </div>
    )
}

export default PersonalDetails;