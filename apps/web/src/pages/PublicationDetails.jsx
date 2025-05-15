import PublicationDetailCard from '@/components/PublicationDetailCards';
import ProgressIndicator from '../components/ProgressIndicator';
import StaticBar from '../components/StaticBar';

const PublicationDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <StaticBar />
            <ProgressIndicator currentStep={12}/>
            <h1 className="text-3xl font-bold text-center">Publication Details</h1>
            <span className='text-center font-semibold py-2'>"Authored wisdom, research, or a bestseller?<br /> Give your works the fame they deserve."</span>
            <PublicationDetailCard/>
        </div>
    )
}

export default PublicationDetails;