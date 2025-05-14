import { Input } from "@/components/ui/input"
import { LoginSignUpPage } from "./pages/Login_Signup_Page";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PersonalDetails from "./pages/PersonalDetailsPage";
// import Terms from "./components/shared/TermAndCondition";
// import PrivacyPolicy from "./components/shared/PrivacyPolicy";
import { CreateAccountPage } from "./pages/CreateAccountPage";
import AwardDetails from "./pages/AwardDetails"
import ProfileSummaryPage from "./pages/ProfileSummayPage";
import EducationDetails from "./pages/EducationDetails";
import ProffesionalDetails from "./pages/ProffesionalDetails";
import SkillsDetails from "./pages/SkillsDetails";
import LanguageDetails from "./pages/LanguageDetails";
import CertificateDetails from "./pages/CertificateDetails";
import ProjectDetails from "./pages/ProjectDetails";
import CourseDetails from "./pages/CoursesDetails";
import OrganizationDetails from "./pages/OrganizationDetails";
import PublicationDetails from "./pages/PublicationDetails";
import ReferenceDetails from "./pages/ReferenceDetails";
import DeclarationDetails from "./pages/DeclarationDetails";
import PreviewPage from "./pages/PreviewPage";

function App() {
  return (
    <div>
      <Router>
       <Routes>
          <Route path="/login" element={<LoginSignUpPage />} />
          {/* <Route path="/terms" element={<Terms />} /> */}
          {/* <Route path="/privacy" element={<PrivacyPolicy />} /> */}
          <Route path="/create-account" element={<CreateAccountPage />} />
          {/* <Route path="/onboarding" element={<PrivacyPolicy />} /> */}
          <Route path="/onboarding/personal-details" element={<PersonalDetails />} />
          <Route path="/onboarding/awards-section" element={<AwardDetails />} />
          <Route path="/onboarding/profile-summary" element={<ProfileSummaryPage />} />
          <Route path="/onboarding/education-section" element={<EducationDetails />} />
          <Route path="/onboarding/professional-section" element={<ProffesionalDetails />} />
          <Route path="/onboarding/skills-section" element={<SkillsDetails />} />
          <Route path="/onboarding/languages-section" element={<LanguageDetails />} />
          <Route path="/onboarding/certificates-section" element={<CertificateDetails />} />
          <Route path="/onboarding/projects-section" element={<ProjectDetails />} />
          <Route path="/onboarding/courses-section" element={<CourseDetails />} />
          <Route path="/onboarding/organizations-section" element={<OrganizationDetails />} />
          <Route path="/onboarding/publications-section" element={<PublicationDetails />} />
          <Route path="/onboarding/references-section" element={<ReferenceDetails />} />
          <Route path="/onboarding/declaration-section" element={<DeclarationDetails />} />
          <Route path="/onboarding/preview" element={<PreviewPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
