import ProffesionalCard from '@/components/ProffesionalDetail';
import ProgressIndicator from '../components/ProgressIndicator';
import StaticBar from '../components/StaticBar';

const ProffesionalDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center  bg-[#F1F0FB]'>
            <StaticBar />
            <ProgressIndicator currentStep={4}/>
            <h1 className="text-2xl sm:text-3xl font-bold text-center">Professional Experience</h1>
            <span className='text-center font-semibold py-2'>"Your career story, proudly presented <br /> — internships, jobs, and hustle included."</span>
            <ProffesionalCard/>
        </div>
    )
}

export default ProffesionalDetails;