import ProgressIndicator from "../components/ProgressIndicator";
import { Button } from "@/components/ui/button";
import StaticBar from "../components/StaticBar";
import { useNavigate } from "react-router-dom";

const OnboardingPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/onboarding/personal-details");
  };

  const handleSkip = () => {
    navigate("/dashboard"); // adjust as per your skip logic
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F0FB]">
      <StaticBar />

      <div className="flex flex-col flex-grow items-center px-4 py-10 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#CA79FF] to-[#1C7EFF] mb-4">
          Welcome to ResumeX
        </h1>

        <p className="text-md md:text-xl text-center max-w-3xl text-gray-700 mb-8">
          ResumeX is your smart assistant for building a powerful, professional resume.
          Follow a simple guided process, and we'll help you create a resume that stands out.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full px-6 mb-12">
          {[
            {
              step: 1,
              title: "Fill Your Details",
              desc: "Enter personal, education, and professional information.",
            },
            {
              step: 2,
              title: "Enter Job Description",
              desc: "Customize your resume based on a specific job description.",
            },
            {
              step: 3,
              title: "Choose a Template",
              desc: "Pick from professionally designed resume templates or Design yourselves as per your need",
            },
            {
              step: 4,
              title: "Download or Share",
              desc: "Export your resume in PDF or share it via a link.",
            },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-purple-200 flex items-center justify-center mb-3 shadow-sm">
                <span className="text-blue-bright font-bold text-lg">{item.step}</span>
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button
            className="text-lg px-6 py-3 rounded-xl bg-gradient-to-r from-[#CA79FF] to-[#1C7EFF] text-white font-semibold shadow-md hover:opacity-90 transition"
            onClick={handleStart}
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            className="text-lg px-6 py-3 rounded-xl border-gray-400 text-gray-700 font-medium hover:bg-gray-100 transition"
            onClick={handleSkip}
          >
            Skip Onboarding
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
