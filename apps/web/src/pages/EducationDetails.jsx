import EducationCard from '@/components/EducationDetailCard';
import ProgressIndicator from '../components/ProgressIndicator';
import StaticBar from '../components/StaticBar';

const EducationDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <StaticBar />
            <ProgressIndicator currentStep={3}/>
            <h1 className="text-2xl sm:text-3xl font-bold text-center">Educational Details</h1>
            <span className='text-center font-semibold py-2'>"Your brainpower deserves the spotlight <br /> — show off your academic adventures!"</span>
            <EducationCard/>
        </div>
    )
}

export default EducationDetails;