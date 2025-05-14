import ProfileSummaryCard from '@/components/ProfileSummaryCard';
import ProgressIndicator from '../components/ProgressIndicator';
import StaticBar from '../components/StaticBar';

const ProfileSummaryPage = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <StaticBar />
            <ProgressIndicator currentStep={2} />
            <h1 className="text-3xl font-bold text-center py-2">Profile Summary</h1>
            <ProfileSummaryCard/>
        </div>
    )
}

export default ProfileSummaryPage;