import PublicationDetailCard from '@/components/PublicationDetailCards';
import ProgressIndicator from '../components/ProgressIndicator';

const PublicationDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <ProgressIndicator currentStep={12}/>
            <PublicationDetailCard/>
        </div>
    )
}

export default PublicationDetails;