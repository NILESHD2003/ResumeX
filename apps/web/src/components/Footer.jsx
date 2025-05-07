import React from 'react';
import {
  LuFacebook,
  LuTwitter,
  LuInstagram,
  LuLinkedin,
  LuGithub,
} from 'react-icons/lu';



function Footer() {
  return (
    <footer className="bg-[#F1F0FB] py-8 text-gray-500">
      
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-[#CA79FF] to-[#1C7EFF] text-transparent bg-clip-text mb-4">
                ResumeX
              </div>
              <p className="text-sm">
                Create beautiful, professional resumes in minutes with our
                easy-to-use platform.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="hover:text-gray-700">
                  <LuFacebook />
                </a>
                <a href="#" className="hover:text-gray-700">
                  <LuTwitter />
                </a>
                <a href="#" className="hover:text-gray-700">
                  <LuInstagram />
                </a>
                <a href="#" className="hover:text-gray-700">
                  <LuLinkedin />
                </a>
                <a href="#" className="hover:text-gray-700">
                  <LuGithub />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Company
              </h3>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-gray-700">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-700">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-700">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-700">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Resources
              </h3>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-gray-700">
                    Resume Tips
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-700">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-700">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Legal
              </h3>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-gray-700">
                    Terms of services
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-700">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-700">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-700">
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-300 pt-4 flex justify-between items-center text-sm">
            <p>© 2025 ResumeX, All Rights Reserved</p>
            <div className="space-x-4">
              <a href="#" className="hover:text-gray-700">
                Terms
              </a>
              <a href="#" className="hover:text-gray-700">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-700">
                Cookies
              </a>
            </div>
          </div>
        </div>
      
    </footer>
  );
}

export default Footer;
