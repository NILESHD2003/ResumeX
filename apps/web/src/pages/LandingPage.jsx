import React from 'react'
import CreateTemplate from "../components/CreateTemplate";
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import ReviewSection from '../components/ReviewsSection'
import Features from '../components/ResumeFeatures'
import Timeline from '../components/TimeLine'
import Footer from '../components/Footer'
import Pricing from '../components/PricingSection'


// importing carousel data to pass props
import carouselData from "../data/carousel-data";

function LandingPage() {
  return (
    <div>
        <NavBar/>
        <Hero/>
        <Features/>
        <CreateTemplate slides={carouselData}/>
        <ReviewSection/>
        <Timeline/>
        <Pricing/>
        <Footer/>
    </div>
    )
  }
        
export default LandingPage
      
        
    

