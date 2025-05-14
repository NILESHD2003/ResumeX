import React, { useState } from 'react';
import {Link} from 'react-scroll'
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openNav = () => setIsOpen(true);
  const closeNav = () => setIsOpen(false);

  const navigate = useNavigate();

  return (
    // Navbar
    <nav className="border-b border-gray-300 p-4 flex justify-between items-center sticky top-0 overflow-hidden z-20 bg-white">
     
        <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#CA79FF] to-[#1C7EFF]">
          ResumeX
        </span>

        {/* Hamburger icon. will trigger overlay when clicked*/}
        <div
          className="flex flex-col justify-center items-center cursor-pointer mr-5"
          onClick={openNav}
        >
          <div className="w-[30px] h-[4px] bg-gray-400 my-[3px]"></div>
          <div className="w-[30px] h-[4px] bg-gray-400 my-[3px]"></div>
          <div className="w-[30px] h-[4px] bg-gray-400 my-[3px]"></div>
        </div>

        {/* Overlay */}
        <div
          className={`fixed top-0 left-0 w-full bg-[#F1F0FB] bg-opacity-25 overflow-hidden z-30 transition-all duration-500 
        ${isOpen ? 'h-full' : 'h-0'}`}
        >
          <button
            className="absolute top-5 right-10 text- text-6xl focus:outline-none"
            onClick={closeNav}
          >
            &times;
          </button>

          <ol className="flex flex-col justify-center items-center mt-30 transition-opacity duration-500 gap-4">
            {isOpen && (
              <>
                <li>
                    <button
                     onClick={()=>{navigate('/login')}}
                     className="px-5 py-3 text-4xl rounded-lg cursor-pointer bg-gradient-to-r from-purple-500 to-blue-400 text-gray-800 hover:bg-[#CA79FF]">
                      Sign Up
                    </button>
                </li>
                <li>
                  <span
                    onClick={()=>{navigate('/login')}}
                    className="text-black my-2 text-5xl cursor-pointer hover:text-purple-200 transition-all"
                  >
                    Login
                  </span>
                </li>
                <li>
                  <Link
                    to='pricing'
                    smooth={true}
                    duration={500}
                    className="text-black my-2 text-5xl cursor-pointer hover:text-purple-200 transition-all"
                    onClick={closeNav}
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="templates"
                    smooth={true}
                    duration={500}
                    className="text-black my-2 text-5xl cursor-pointer hover:text-purple-200 transition-all"
                    onClick={closeNav}
                  >
                    Templates
                  </Link>
                </li>
              </>
            )}
          </ol>
        </div>
      
    </nav>
  );
};

export default NavBar;
