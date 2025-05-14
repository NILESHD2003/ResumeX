import React from 'react';
import {Link} from 'react-scroll'

const Hero = () => {
  return (
    <section className="max-w-[1200px] mx-auto px-4 flex flex-col items-center text-center gap-8 mt-12">
    
        {/* Heading */}
        <h1 className="text-5xl font-extrabold text-black leading-tight">
          Create a professional resume in <br />
          <span className="bg-gradient-to-r from-[#CA79FF] to-[#1C7EFF] bg-clip-text text-transparent">
            minutes
          </span>
        </h1>

        {/* Description */}
        <p className="text-[#9D9D9D] max-w-2xl">
          A modern resume builder that helps you craft the perfect resume to get
          your dream job. Beautiful templates, easy-to-use editor, and expert
          tips included.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
          to='templates'
          smooth={true}
          duration={500} 
          className="bg-gradient-to-r from-[#CA79FF] to-[#1C7EFF] text-white px-6 py-3 rounded-full cursor-pointer"
          >
            Create templates →
          </Link>

          <Link
          to="templates"
          smooth={true}
          duration={500}
          className="border border-[#CCCCCC] bg-white text-black px-6 py-3 rounded-full cursor-pointer">
            View Templates
          </Link>
        </div>

        {/* Hero Image */}
        <img
          src="/assets/hero-image.jpeg"
          alt="Hero"
          className="mt-8 w-full object-cover shadow-2xl rounded-lg"
        />
      
    </section>
  );
};

export default Hero;
