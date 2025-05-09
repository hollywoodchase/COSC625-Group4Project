import React, { useState, useEffect } from 'react';
import heroImage1 from '../assets/images/hero-1.jpg';
import heroImage2 from '../assets/images/hero-2.jpg';
import heroImage3 from '../assets/images/hero-3.jpg';
import heroImage4 from '../assets/images/hero-4.jpg';
import heroImage5 from '../assets/images/hero-5.jpg';
import nps_foundation from '../assets/images/nps_foundation.png';
import frostburg from '../assets/images/frostburg.png';
import { useNavigate } from "react-router-dom";
import { fetchActivities } from '../services/npsApi';

// Image paths relative to the 'public' folder
const heroImages = [heroImage1, heroImage2, heroImage3, heroImage4, heroImage5]

const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [backgroundStyle, setBackgroundStyle] = useState({});
  const navigate = useNavigate();

  // Activities state
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState(null);
  
  // References for auto-scrolling
  const row1Ref = React.useRef(null);
  const row2Ref = React.useRef(null);

  // Effect to change the image index every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 7000); // Change image every 7 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // Effect to update the background style when the index changes
  useEffect(() => {
    setBackgroundStyle({
      backgroundImage: `url('${heroImages[currentImageIndex]}')`,
    });
  }, [currentImageIndex]);

  useEffect(() => {
    fetchActivities()
      .then(data => {
        setActivities(data);
        setActivitiesLoading(false);
      })
      .catch(err => {
        setActivitiesError(err.message || 'Failed to load activities');
        setActivitiesLoading(false);
      });
  }, []);
  
  // Auto-scroll effect for activities
  useEffect(() => {
    if (activitiesLoading || activitiesError || activities.length === 0) {
      return; // Don't set up scrolling if data isn't ready
    }
    
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    
    if (!row1 || !row2) return;
    
    // Set initial positions
    row1.scrollLeft = 0;
    row2.scrollLeft = 0;
    
    // Lower values = slower scrolling
    const SCROLL_SPEED = 0.5;
    let lastTime = 0;
    
    const animateScroll = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;
      
      // Calculate movement based on time delta for consistent speed
      const moveAmount = SCROLL_SPEED * (delta / 16); // normalize to ~60fps
      
      // First row scrolls right
      if (row1.scrollLeft >= (row1.scrollWidth / 2)) {
        row1.scrollLeft = 0; // Reset when we reach half (original set of items)
      } else {
        row1.scrollLeft += moveAmount;
      }
      
      // Second row scrolls left (starts from end)
      if (row2.scrollLeft <= 0) {
        row2.scrollLeft = row2.scrollWidth / 2; // Reset when we reach start
      } else {
        row2.scrollLeft -= moveAmount;
      }
      
      animationFrameId = requestAnimationFrame(animateScroll);
    };
    
    let animationFrameId = requestAnimationFrame(animateScroll);
    
    // Cleanup function to cancel animation when component unmounts
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activities, activitiesLoading, activitiesError]);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section
        id="home"
        className="hero-section min-h-screen flex flex-col justify-center items-center text-center text-white relative overflow-hidden bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={backgroundStyle}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="z-10 max-w-2xl px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">Discover the Wonders of Nature.</h1>
          <a 
            href="parksearch" 
            className="inline-block mt-8 px-8 py-3 bg-white text-gray-800 font-semibold rounded-md hover:bg-gray-100 transition-colors duration-300 shadow-lg"
          >
            Explore
          </a>
        </div>
        
        {/* Dots indicators for slideshow */}
        <div className="absolute bottom-12 flex space-x-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentImageIndex % 3 ? 'bg-white' : 'bg-white bg-opacity-50'}`}
            ></div>
          ))}
        </div>
      </section>

      

      {/* National Parks Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">NATIONAL PARKS AROUND US</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">A headline about our national parks & their wonders</h2>
          </div>
          
          {/* Statistics Grid - improved layout matching design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">94M+</h3>
              <p className="text-sm text-gray-600">Annual visitors to national parks</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">63</h3>
              <p className="text-sm text-gray-600">Total number of national parks</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">3,370 Sq.Km</h3>
              <p className="text-sm text-gray-600">Average size of a national park</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">32B</h3>
              <p className="text-sm text-gray-600">Estimated annual revenue from park visitors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section - Better layout matching design */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Left side (optional photo) */}
            <div className="md:w-2/5 lg:w-1/2 bg-gray-100 rounded-lg overflow-hidden hidden md:block">
              <img 
                src={heroImage5}
                alt="National Park scenery" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Right side with text and call to action */}
            <div className="md:w-3/5 lg:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">Explore the Great Outdoors Today!</h2>
              <p className="text-gray-700 mb-8 text-lg">
                Discover the beauty and wonder of America's National Parks. Your journey begins with just one click.
              </p>
              
              <div className="mb-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 mt-1 rounded-full bg-green-500 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-gray-800">Observe, Investigate, and Appreciate the Wonders of Nature</p>
                    <p className="text-gray-600 text-sm mt-1">Access detailed park information and extras, making it easier to navigate to specific destinations.</p>
                  </div>
                </div>
              </div>
              
              <button onClick={() => {
                  navigate("/COSC625-Group4Project/login"); // redirect
                }} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-md transition duration-300 shadow-md">
                Embark on Your Journey
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section - Improved card design */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-gray-800">Experience the Great Outdoors</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <img 
                src={heroImage2}
                alt="Activities and sightseeing" 
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 text-gray-800">Activities / Sightseeing</h3>
                <p className="text-gray-600">
                  Discover the breathtaking landscapes and view the most beautiful sights our parks have to offer.
                </p>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <img 
                src={heroImage4}
                alt="Conservation efforts" 
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 text-gray-800">Conservation Efforts</h3>
                <p className="text-gray-600">
                  Join us in our mission to protect and preserve these natural wonders for future generations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Scrolling Activities Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">Exciting Activities</h2>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">Discover a wide range of exciting activities available at national parks across the country.</p>
          
          {activitiesLoading ? (
            <div className="text-center py-12">Loading activities...</div>
          ) : activitiesError ? (
            <div className="text-center py-12 text-red-500">{activitiesError}</div>
          ) : (
            <div className="overflow-hidden">
              {/* Auto-scrolling activities */}
              <div className="relative mb-6">
                <div ref={row1Ref} className="flex overflow-hidden pb-4 -mx-4 px-4 space-x-4">
                  {/* Double the activities to create seamless loop effect */}
                  {[...activities, ...activities].map((activity, index) => (
                    <div 
                      key={`row1-${index}-${activity.id}`} 
                      className="flex-shrink-0 w-60 bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:scale-105"
                    >
                      <span className="font-medium text-gray-800">{activity.name}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
              </div>
              
              {/* Second row of activities - scrolls in opposite direction */}
              <div className="relative">
                <div ref={row2Ref} className="flex overflow-hidden pb-4 -mx-4 px-4 space-x-4">
                  {/* Double the activities to create seamless loop effect, reverse for opposite direction */}
                  {[...activities, ...activities].reverse().map((activity, index) => (
                    <div 
                      key={`row2-${index}-${activity.id}`} 
                      className="flex-shrink-0 w-60 bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:scale-105"
                    >
                      <span className="font-medium text-gray-800">{activity.name}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
              </div>
            </div>
          )}

          {/* Animation is handled by useEffect hook */}
        </div>
      </section>


      {/* Partners Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-gray-800">Our Partners</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 items-center justify-items-center">
            {/* National Park Foundation */}
            <a href="https://www.nationalparks.org/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
              <img src={nps_foundation} alt="National Park Foundation" className="h-14 object-contain mb-2 transition-transform group-hover:scale-105" />
              <span className="text-xs text-gray-700">National Park Foundation</span>
            </a>
            {/* Frostburg State University */}
            <a href="https://www.frostburg.edu/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
              <img src={frostburg} alt="Frostburg State University" className="h-14 object-contain mb-2 transition-transform group-hover:scale-105 bg-white rounded-full" />
              <span className="text-xs text-gray-700">Frostburg State University</span>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Image Section - Improved sizing and no cropping */}
      <section className="relative">
        <img 
          src={heroImage1}
          alt="Beautiful landscape of a national park" 
          className="w-full h-auto md:h-[500px] object-cover object-center"
        />
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center text-sm">
          <p> 2025 National Park Explorer. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <a href="#" className="text-gray-300 hover:text-white">Privacy</a>
            <a href="#" className="text-gray-300 hover:text-white">Terms</a>
            <a href="#" className="text-gray-300 hover:text-white">About</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
