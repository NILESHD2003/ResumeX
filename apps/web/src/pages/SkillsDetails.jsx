import SkillsDetailCard from '@/components/SkillsDetailCard';
import ProgressIndicator from '../components/ProgressIndicator';

const SkillsDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <ProgressIndicator currentStep={5}/>
            <SkillsDetailCard/>
        </div>
    )
}

export default SkillsDetails;