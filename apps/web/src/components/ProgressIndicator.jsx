import React from 'react';
import { cn } from "@/lib/utils";

const ProgressIndicator = ({ currentStep }) => {
  const steps = [
    "Personal Details",
    "Profile Summary",
    "Education Details",
    "Professional Experience",
    "Skill Details",
    "Language Details",
    "Certification Details",
    "Project Details",
    "Award Details",
    "Course Details",
    "Organization Details",
    "Publication Details",
    "Reference Details",
    "Declaration",
  ];

  const themeColors = "bg-gradient-to-r from-[#1C7EFF] to-[#CA79FF] text-white";

  return (
    <div className="flex justify-center items-center w-full py-5">
      {steps.map((step, index) => (
        <div key={index} className="relative md:gap-4 lg:gap-7 flex items-center">
          {index > 0 && (
            <div className={`flex-grow h-0.5 ${
                index < currentStep ? themeColors : 'bg-gray-300'
              }`}>
            </div>
          )}
          <div
            className={`flex items-center justify-center rounded-full border-2 border-gray-300 w-8 h-8 sm:w-10 sm:h-10 ${
              index < currentStep - 1 ? `border-transparent ${themeColors}` : ''
            } ${index === currentStep - 1 ? `border-transparent ${themeColors}` : ''}`}
          >
            {index < currentStep - 1 ? (
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <span className={`${index < currentStep ? 'text-white' : 'text-gray-700'}`}>
                {index + 1}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;