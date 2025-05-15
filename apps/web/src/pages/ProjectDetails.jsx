import ProjectDetailsCard from '@/components/ProjectDetailsCard';
import ProgressIndicator from '../components/ProgressIndicator';
import StaticBar from '../components/StaticBar';

const ProjectDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <StaticBar />
            <ProgressIndicator currentStep={8}/>
            <h1 className="text-3xl font-bold text-center">Project Details</h1>
            <span className='text-center font-semibold py-2'>"Battle-tested and project-approved <br /> — highlight the cool stuff you've built!"</span>
            <ProjectDetailsCard/>
        </div>
    )
}

export default ProjectDetails;