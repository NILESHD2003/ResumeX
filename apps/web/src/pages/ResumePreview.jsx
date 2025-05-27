import { useEffect, useState } from 'react';
import TemplateOne from '../components/resume-templates/TemplateOne';
import { getProfileDetails } from '../services/operations/profileDetailsAPIS';
import { toast, Toaster } from 'sonner';

const ResumePreview = () => {
    const [resumeData, setResumeData] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            const data = await getProfileDetails()
            if (data) {
                setResumeData(data);
                toast.success("Data is Loading")
                console.log(data);
            }
            else {
                toast.warning("Enter data for resume preview");
            }
        };
        fetchData();
    }, [])

  return (
    <div>
        <Toaster />
        <TemplateOne data={resumeData}/>
    </div>
  )
}

export default ResumePreview