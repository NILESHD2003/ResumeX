import CourseDetailCard from '@/components/CourseDetailCard';
import ProgressIndicator from '../components/ProgressIndicator';
import StaticBar from '../components/StaticBar';

const CourseDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <StaticBar />
            <ProgressIndicator currentStep={10}/>
            <h1 className="text-3xl font-bold text-center">Course Details</h1>
            <span className='text-center font-semibold py-2'>"Late-night courses, weekend warrior programs? <br /> They all count, let's list them!"</span>
            <CourseDetailCard/>
        </div>
    )
}

export default CourseDetails;