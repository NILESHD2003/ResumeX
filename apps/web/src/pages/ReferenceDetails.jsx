import ReferenceDetailCard from '@/components/ReferenceDetailCards';
import ProgressIndicator from '../components/ProgressIndicator';
import StaticBar from '../components/StaticBar';

const ReferenceDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <StaticBar />
            <ProgressIndicator currentStep={13}/>
            <h1 className="text-3xl font-bold text-center">Reference Details</h1>
            <span className='text-center font-semibold py-2'>"Got people who sing your praises? <br />Let's introduce them (modestly, of course)."</span>

            <ReferenceDetailCard/>
        </div>
    )
}

export default ReferenceDetails;