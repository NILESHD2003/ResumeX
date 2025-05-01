import ProjectDetailsCard from '@/components/ProjectDetailsCard';
import ProgressIndicator from '../components/ProgressIndicator';

const ProjectDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-[#F1F0FB]'>
            <ProgressIndicator currentStep={8}/>
            <ProjectDetailsCard/>
        </div>
    )
}

export default ProjectDetails;