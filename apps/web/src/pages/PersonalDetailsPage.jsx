import PersonalDetailsForm from '@/components/PersonalDetailsCard';
import ProgressIndicator from '../components/ProgressIndicator';

const PersonalDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <ProgressIndicator currentStep={1}/>
            <PersonalDetailsForm/>
        </div>
    )
}

export default PersonalDetails;