import ProfileImgandSum from '@/components/ProfileImgandSum';
import ProgressIndicator from '../components/ProgressIndicator';

const ProfileDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-[#F1F0FB]'>
            <ProgressIndicator currentStep={2}/>
            <ProfileImgandSum/>
        </div>
    )
}

export default ProfileDetails;