import LanguageDetailsCard from '@/components/LanguageDetailCard';
import ProgressIndicator from '../components/ProgressIndicator';
import StaticBar from '../components/StaticBar';

const LanguageDetails = () => {
    return (
        <div className='min-h-screen flex flex-col items-center bg-[#F1F0FB]'>
            <StaticBar />
            <ProgressIndicator currentStep={6}/>
            <h1 className="text-3xl font-bold text-center">Language Details</h1>
            <span className='text-center font-semibold py-2'>"Multilingual magic? Let's flaunt it. <br /> Every extra language is a superpower!"</span>
            <LanguageDetailsCard/>
        </div>
    )
}

export default LanguageDetails;