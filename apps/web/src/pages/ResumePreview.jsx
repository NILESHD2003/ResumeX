'use client';

import { useEffect, useState, useRef } from 'react';
import TemplateOne from '../components/resume-templates/TemplateOne';
import { getProfileDetails } from '../services/operations/profileDetailsAPIS';
import { toast, Toaster } from 'sonner';
import SpacingEditor from '../components/editor-components/SpacingEditor';
import FontEditor from '../components/editor-components/FontEditor';
import HeadingEditor from '../components/editor-components/HeadingEditor';
import { useSelector } from 'react-redux';
// import Navbar from '../components/editor-components/EditorNavbar';
import HeaderEditor from '../components/editor-components/HeaderEditor';
import AdvancedEditor from '../components/editor-components/AdvancedOptions';
import CertificatesEditor from '../components/editor-components/CertificatesEditor';
import DeclarationEditor from '../components/editor-components/DeclarationEditor';
import EducationEditor from '../components/editor-components/EducationsEditor';
import FooterEditor from '../components/editor-components/FooterEditor';
import JobTitleEditor from '../components/editor-components/JobTitleEditor';
import LanguagesEditor from '../components/editor-components/LanguagesEditor';
import NameEditor from '../components/editor-components/NameEditor';
import ProfessionalExperienceEditor from '../components/editor-components/ProfessionalExpEditor';
import ProfileEditor from '../components/editor-components/ProfileEditor';
import SkillsEditor from '../components/editor-components/SkillsEditor';
import LayoutEditor from '../components/editor-components/LayoutEditor';
import { getUserSpecificResume } from '../services/operations/resumeDataAPIS';
import { FileText, Sparkles, Share2, Download, MoreVertical, ChevronDown, ArrowLeft } from 'lucide-react';
import { useReactToPrint } from "react-to-print";

const ResumePreview = () => {
  const [resumeData, setResumeData] = useState({});
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [resumeMetadata, setResumeMetadata ] = useState({
    layout: {
        columns: "one",
        headerPosition: "top",
        sectionArrangement: [],
        twoRowSectionArrangement: []
    },
    spacing: {
        fontSize: 9,
        lineHeight: 1.1,
        yMargin: 10,
        xMargin: 10,
        spaceBetnEntries: 1
    },
    colors: {
        style: "basic",
        basicStyleOptions: {
            accent: "#000000",
            multiTheme: {
                textColor: "#000000",
                backgroundColor: "#000000",
                accentColor: "#000000",
            }
        },
        advancedStyleOptions: {
            accent: "#000000",
            multiTheme: {
                headerTextColor: "#000000",
                headerBackgroundColor: "#000000",
                headerAccentColor: "#000000",
                textColor: "#000000",
                backgroundColor: "#000000",
                accentColor: "#000000",
            }
        },
        borderStyleOptions: {
            accent: "#000000",
            borderSize: "S",
            showTop: true,
            showRight: true,
            showBotton: true,
            showLeft: true,
        },
        applyName: true,
        applyHeadings: true,
        applyHeadingsLink: true,
        applyHeaderIcons: false,
        applyDotsBarsBubbles: false,
        applyDates: false,
        applyLink: false,
    },
    font: {
        fontCategory: "serif",
        fontFamily: "Amiri"
    },
    heading: {
        headingStyle: "box",
        capitalization: "capitalize",
        size: "s",
        icons: "none",
    },
    entryLayout: {
        layoutType: "type1",
        titleSubtitleSize: "s",
        subtitleStyle: "normal",
        subtitlePlacement: "same-line",
        descriptionIndention: false,
        listStyle: "bullet"
    },
    header: {
        headerType: "left",
        detail: "tiled",
        infoStyle: "icon",
        iconShape: "none",
        detailOrder: ["mail", "github", "dob", "location"]
    },
    name: {
        nameSize: "XS",
        bold: true,
        font: "body",
        creativeFontOption: ""
    },
    jobTitle: {
        jobTitleSize: "S",
        position: "same-line",
        jobTitleStyle: "normal"
    },
    footer: {
        pageNo: false,
        email: false,
        name: false
    },
    skills: {
        layout: "grid",
        layoutInfo: "grid-cols-2",
        subInfoStyle: "none"
    },
    languages: {
        layout: "grid",
        layoutInfo: "grid-cols-2",
        subInfoStyle: "none"
    },
    certificates: {
        layout: "grid",
        layoutInfo: "grid-cols-2",
        subInfoStyle: "none"
    },
    profile: {
        showHeading: true
    },
    professionalExperience: {
        titleSubtitleOrder: "jobTitle-Employer",
    },
    education: {
        titleSubtitleOrder: "school-degree",
    },
    declaration: {
        showHeading: true,
        declarationPosition: "left",
        showLine: false
    },
    advancedOptions: {
        linkIcon: "none",
        reduceDateLocationOpacity: false
    },
    localizationSettings: {
        dateFormat: "DD/MM/yyyy"
    },
    photo: {
        showPhoto: true,
        size: "XS"
    }
  })

  const jobId = useSelector((state) => state.job.jobId);

  useEffect(() => {
    console.log(resumeMetadata)
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserSpecificResume(jobId);
      if (data) {
        setResumeData(data);
        console.log("Fetched Resume Data:", data);
        toast.success('Resume data loaded');

        const {
          personalDetails,
          profileSummary,
          educationDetails,
          skills,
          professionalExperience,
          languages,
          certificates,
          projects,
          awards,
          courses,
          organizations,
          publications,
          references,
          declaration,
        } = data;

        const dynamicSectionArrangement = [];

        if (profileSummary) dynamicSectionArrangement.push("profileSummary");
        if (educationDetails?.length) dynamicSectionArrangement.push("educationDetails");
        if (skills?.rankedSkills.length) dynamicSectionArrangement.push("skills");
        if (professionalExperience?.length) dynamicSectionArrangement.push("professionalExperience");
        if (languages?.length) dynamicSectionArrangement.push("languages");
        if (certificates?.length) dynamicSectionArrangement.push("certificates");
        if (projects?.length) dynamicSectionArrangement.push("projects");
        if (awards?.length) dynamicSectionArrangement.push("awards");
        if (courses?.length) dynamicSectionArrangement.push("courses");
        if (organizations?.length) dynamicSectionArrangement.push("organizations");
        if (publications?.length) dynamicSectionArrangement.push("publications");
        if (references?.length) dynamicSectionArrangement.push("references");
        if (declaration) dynamicSectionArrangement.push("declaration");

        const mid = Math.ceil(dynamicSectionArrangement.length / 2);
        const firstCol = dynamicSectionArrangement.slice(0, mid);
        const secondCol = dynamicSectionArrangement.slice(mid);

        console.log(dynamicSectionArrangement)

        setResumeMetadata((prev) => ({
          ...prev,
          layout: {
            ...prev.layout,
            sectionArrangement: dynamicSectionArrangement,
            twoRowSectionArrangement: [firstCol, secondCol],
          },
        }));
      } else {
        toast.warning('No resume data found. Please enter data for resume preview.');
      }
    };
    fetchData();
  }, [jobId]);

  const handleDownloadPrint = () => {
    window.print();
  };


  return (
    <>
      <div className="bg-[#f1effd] min-h-screen w-full print:hidden">
        <div className="flex justify-between items-center bg-white px-6 py-3 rounded-md shadow-sm">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* ... buttons */}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          <button 
          className="flex items-center px-3 py-1.5 bg-[#f3f4f6] text-sm rounded-md">
            Resume 1
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>

          {/* Download Button with onClick */}
              <button
               onClick={handleDownloadPrint}
               className="flex items-center space-x-1 bg-[#2d0c4d] text-[#ffffff] px-4 py-2 rounded-md text-sm">
                <span>Download</span>
                <Download className="w-4 h-4" />
              </button>
          
          <button className="p-2 border border-[#d1d5dc] rounded-md">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
        <Toaster />
        <div className="grid grid-cols-12 px-20 h-[calc(100vh-64px)]">
          {/* Left Panel: Editors */}
          <div className="col-span-5 overflow-y-auto p-6 space-y-6 scrollbar-none">
              <LayoutEditor resumeMetadata={resumeMetadata} setResumeMetadata={setResumeMetadata}/>
              <SpacingEditor resumeMetadata={resumeMetadata} setResumeMetadata={setResumeMetadata}/>
              <FontEditor resumeMetadata={resumeMetadata} setResumeMetadata={setResumeMetadata}/>
              <HeadingEditor resumeMetadata={resumeMetadata} setResumeMetadata={setResumeMetadata}/>
              {/* <HeaderEditor resumeMetadata={resumeMetadata} setResumeMetadata={setResumeMetadata}/> */}
              <NameEditor resumeMetadata={resumeMetadata} setResumeMetadata={setResumeMetadata}/>
              <JobTitleEditor resumeMetadata={resumeMetadata} setResumeMetadata={setResumeMetadata}/>
              {/* <FooterEditor resumeMetadata={resumeMetadata} setResumeMetadata={setResumeMetadata}/> */}
              {/* <AdvancedEditor resumeMetadata={resumeMetadata} setResumeMetadata={setResumeMetadata}/> */}
              <SkillsEditor resumeMetadata={resumeMetadata} setResumeMetadata={setResumeMetadata}/>
              <LanguagesEditor resumeMetadata={resumeMetadata} setResumeMetadata={setResumeMetadata}/>
              <CertificatesEditor resumeMetadata={resumeMetadata} setResumeMetadata={setResumeMetadata}/>
              {/* <ProfileEditor resumeMetadata={resumeMetadata} setResumeMetadata={setResumeMetadata}/> */}
              <EducationEditor resumeMetadata={resumeMetadata} setResumeMetadata={setResumeMetadata}/>
              <ProfessionalExperienceEditor resumeMetadata={resumeMetadata} setResumeMetadata={setResumeMetadata}/>
              {/* <DeclarationEditor resumeMetadata={resumeMetadata} setResumeMetadata={setResumeMetadata}/> */}
            {/* Add more editors as needed */}
          </div>

          {/* Right Panel: Resume Preview */}
          <div className="hidden lg:flex col-span-7 p-6 items-start justify-center overflow-y-auto">
          <div className="w-fit  bg-[#ffffff]" id='resume'>
            <TemplateOne data={resumeData} metadata={resumeMetadata} />
          </div>
        </div>

        </div>
        {/* Floating Button on Small Screens */}
          <div className="lg:hidden fixed bottom-6 right-6 z-50">
              <button
                  onClick={() => setShowMobilePreview(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg"
              >
                  Show Preview
              </button>
          </div>

          {/* Mobile Preview Modal */}
          {showMobilePreview && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-[850px] max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6 relative">
              <button
                  onClick={() => setShowMobilePreview(false)}
                  className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
              >
                  ✕
              </button>
              <TemplateOne data={resumeData} />
              </div>
          </div>
          )}
      </div>
      <div>
        <TemplateOne data={resumeData} metadata={resumeMetadata} />
      </div>
    </>
  );
};

export default ResumePreview;
