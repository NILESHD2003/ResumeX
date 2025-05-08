import React from 'react';
import templateIcon from '/assets/template-icon.png';
import editIcon from '/assets/edit-icon.png';
import contentIcon from '/assets/content-icon.png';
import downloadIcon from '/assets/download-icon.png';
import optimiseIcon from '/assets/optimise-icon.png';
import timeIcon from '/assets/time-icon.png';


const ResumeFeatures = () => {
  // Features data
  const features = [
    {
      icon: templateIcon,
      title: 'Beautiful Templates',
      description:
        'Choose from our collection of professionally designed and ATS-friendly resume templates.',
    },
    {
      icon: editIcon,
      title: 'Easy-to-use Editor',
      description:
        'Our intuitive drag-and-drop editor makes creating and updating your resume simple.',
    },
    {
      icon: contentIcon,
      title: 'Content Suggestions',
      description:
        'Get expert suggestions for each section of your resume to make it stand out.',
    },
    {
      icon: downloadIcon,
      title: 'Multiple Export Options',
      description:
        'Download your resume as PDF, Word, or share a link directly with employers.',
    },
    {
      icon: optimiseIcon,
      title: 'ATS Optimization',
      description:
        'Ensure your resume passes through Applicant Tracking Systems with our optimizer.',
    },
    {
      icon: timeIcon,
      title: 'Save Time',
      description:
        'Create a professional resume in minutes, not hours, with our streamlined process.',
    },
  ];

  return (
    // Implementing features (title section)
    <div className="bg-[#F1F0FB] py-16 mt-15 rounded-lg">
      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need for the perfect resume
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Our platform offers all the tools to create, edit, and share your
              professional resume.
            </p>
          </div>

          {/* Mapping actual features */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="mb-4">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      
    </div>
  );
};

export default ResumeFeatures;
