import React from 'react';
import { cn } from "@/lib/utils";

const ProgressIndicator = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center">

        <div className={cn(
            "sm:w-30 sm:h-30 w-20 h-20 rounded-full border-2 flex items-center justify-center text-lg",
            currentStep === 1
              ? "border-[#F1F0FB] text-[#F1F0FB]"
              : "border-gray-300 text-gray-500"
        )}>
          {currentStep - 1}
        </div>

        <div className={cn(
            "h-1 sm:w-24 w-15",
            currentStep === 1
              ? "bg-[#F1F0FB]"
              : "bg-gray-300"
        )}></div>

        <div
          className="sm:w-20 sm:h-20 w-15 h-15 rounded-full flex items-center justify-center text-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white"
        >
          {currentStep}
        </div>

        <div className={cn(
            "h-1 sm:w-24 w-15",
            currentStep === 15
              ? "bg-[#F1F0FB]"
              : "bg-gray-300"
        )}></div>

        <div className={cn(
            "sm:w-30 sm:h-30 w-20 h-20 rounded-full border-2 flex items-center justify-center text-lg",
            currentStep === 15
              ? "border-[#F1F0FB] text-[#F1F0FB]"
              : "border-gray-300 text-gray-500"
        )}>
          {currentStep + 1}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
