import { useEffect, useState } from 'react';
import TemplateOne from '../components/resume-templates/TemplateOne';
import { getProfileDetails } from '../services/operations/profileDetailsAPIS';
import { toast, Toaster } from 'sonner';
import SpacingEditor from '../components/editor-components/SpacingEditor';
import FontEditor from '../components/editor-components/FontEditor';
import HeadingEditor from '../components/editor-components/HeadingEditor';
import NameEditor from '../components/editor-components/NameEditor';
import JobTitleEditor from '../components/editor-components/JobTitleEditor';
import HeaderEditor from '../components/editor-components/HeaderEditor';

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
        {/* <TemplateOne data={resumeData}/> */}
        {/* <SpacingEditor /> */}
        {/* <FontEditor /> */}
        {/* <HeadingEditor /> */}
        {/* <NameEditor /> */}
        {/* <JobTitleEditor /> */}
        <HeaderEditor />
    </div>
  )
}

export default ResumePreview