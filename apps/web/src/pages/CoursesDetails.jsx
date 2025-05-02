import CourseDetailCard from '@/components/CourseDetailCard';
import ProgressIndicator from '../components/ProgressIndicator';

const CourseDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <ProgressIndicator currentStep={10}/>
            <CourseDetailCard/>
        </div>
    )
}

export default CourseDetails;