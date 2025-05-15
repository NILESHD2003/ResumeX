import SkillsDetailCard from '@/components/SkillsDetailCard';
import ProgressIndicator from '../components/ProgressIndicator';
import StaticBar from '../components/StaticBar';

const SkillsDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <StaticBar />
            <ProgressIndicator currentStep={5}/>
            <h1 className="text-3xl font-bold text-center">Skills Details</h1>
            <span className='text-center font-semibold py-2'>"Your superpowers, all in one place <br />— technical, people, and secret skills welcome!"</span>
            <SkillsDetailCard/>
        </div>
    )
}

export default SkillsDetails;