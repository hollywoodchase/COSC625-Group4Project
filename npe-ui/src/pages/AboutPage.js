import React, { useState, useEffect } from 'react';
import heroImage7 from '../assets/images/hero-7.jpg';
import heroImage8 from '../assets/images/hero-8.jpg';
import { Link } from 'react-router-dom';
import { fetchNpsAlerts } from '../services/npsApi';
import { AlertSliderWithPreferences } from '../components/AlertSlider';
import SimDImage from '../assets/images/SimD.jpg';
import MasonW from '../assets/images/MasonW.png';
import DanielC from '../assets/images/DanielC.jpg';
import CameronR from '../assets/images/CameronR.png';
import DhrumilT from '../assets/images/DhrumilT.jpg';

const AboutPage = () => {
  // Mock data for User Testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Liam Beck',
      role: 'Outdoor Ranger',
      quote: 'The National Park Explorer app is a must-have for any nature enthusiast!',
      avatar: '/images/avatar-1.jpg', // Placeholder
    },
    {
      id: 2,
      name: 'Aria Willow',
      role: 'Travel Writer',
      quote: 'A fantastic resource for planning my national park adventures.',
      avatar: '/images/avatar-2.jpg', // Placeholder
    },
    {
      id: 3,
      name: 'Noah Pine',
      role: 'Environmental Scientist',
      quote: 'An invaluable tool for understanding our parks.',
      avatar: '/images/avatar-3.jpg', // Placeholder
    },
    {
      id: 4,
      name: 'Emma Maple',
      role: 'Hiking Enthusiast',
      quote: 'The detailed guides and maps are simply amazing!',
      avatar: '/images/avatar-4.jpg', // Placeholder
    },
  ];

  // FAQ items
  const faqItems = [
    {
      id: 1,
      question: 'What parks are included in the platform?',
      answer: 'Our platform includes all 63 US National Parks.'
    },
    {
      id: 2,
      question: 'What is the role of the platform?',
      answer: 'The platform is a platform that helps users plan their national park adventures, provides information about the parks, and helps users prepare for their adventures.'
    },
    {
      id: 3,
      question: 'Can I contribute to the platform\'s content?',
      answer: 'Yes! Users can submit photos, trail reviews, and wildlife sightings.'
    },
    {
      id: 4,
      question: 'What all features are available in the platform?',
      answer: 'The platform includes features such as park search, interactive map, user account management, weather and alerts, and more.'
    },
  ];

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Daniel Calise',
      role: '',
      bio: 'Passionate about creating intuitive user interfaces optimizing performance.',
      image: DanielC, 
      github: 'https://github.com/hollywoodchase',
      linkedin: 'https://www.linkedin.com/in/daniel-calise'
    },
    {
      id: 2,
      name: 'Sim Dashdondog',
      role: '',
      bio: 'Creates beautiful, user-centered designs with a deep understanding.',
      image: SimDImage,
      github: 'https://github.com/udashdon4',
      linkedin: 'https://www.linkedin.com/in/sim-dashdondog-37b91b265'
    },
    {
      id: 3,
      name: 'Cameron Robertson',
      role: '',
      bio: 'Experienced in database design and Backend code development.',
      image: CameronR,
      github: 'https://github.com/cfrobertson0',
      linkedin: 'https://www.linkedin.com/in/cameronrobertson333'
    },
    {
      id: 4,
      name: 'Mason Warner',
      role: '',
      bio: 'Dedicated to building secure and scalable server architectures.',
      image: MasonW,
      github: 'https://github.com/Mason-Warner',
      linkedin: 'https://www.linkedin.com/in/mason-warner-718b7121b'
    },
    {
      id: 5,
      name: 'Dhrumil Thakkar',
      role: '',
      bio: 'Excited about ensuring user experience and proper information.',
      image: DhrumilT,
      github: 'https://github.com/dhrumilvthakkar',
      linkedin: 'https://www.linkedin.com/in/dhrumilvthakkar'
    }
  ];

  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [alertsError, setAlertsError] = useState(null);

  useEffect(() => {
    fetchNpsAlerts()
      .then(data => {
        setAlerts(data);
        setAlertsLoading(false);
      })
      .catch(err => {
        setAlertsError(err.message || 'Failed to load alerts');
        setAlertsLoading(false);
      });
  }, []);

  return (
    <div className="about-page bg-white">
      {/* Hero/Mission Statement Section */}
      <section className="py-16 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            The National Park Explorer is dedicated to enhancing public awareness of 
            national park conservation, empowering visitors with the knowledge and 
            resources they need to prepare for their adventures while promoting conscious 
            tourism practices.
          </p>
        </div>
      </section>

      {/* Official Park Alerts */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Official Park Alerts</h2>
          {alertsLoading && (
            <div className="text-gray-500 text-center py-8">Loading alerts...</div>
          )}
          {alertsError && (
            <div className="text-red-600 text-center py-8">{alertsError}</div>
          )}
          {!alertsLoading && !alertsError && alerts.length === 0 && (
            <div className="text-gray-500 text-center py-8">No alerts at this time.</div>
          )}
          {!alertsLoading && !alertsError && alerts.length > 0 && (
            <div>
              <AlertSliderWithPreferences alerts={alerts} visibleCount={4} autoScroll={true} />
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-2">You can customize which alerts you see in your account settings.</p>
                <Link 
                  to="/COSC625-Group4Project/account"
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Customize Alert Preferences
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">Meet Our Team</h2>
          
          <div className="grid grid-cols-5 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex flex-col items-center">
                    {/* Team member avatar/placeholder */}
                  <div>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-43 h-43 rounded-full object-cover mb-4 shadow-md"
                    />
                    </div>
                  

                    <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                    <p className="text-green-600 font-medium mb-4">{member.role}</p>
                    
                    <p className="text-gray-600 text-center mb-6">{member.bio}</p>
                    
                    <div className="flex space-x-4">
                      <a 
                        href={member.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-green-700 transition-colors"
                        aria-label="GitHub"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                      <a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-700 transition-colors"
                        aria-label="LinkedIn"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section>

      
      {/* User Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-12 text-center">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden mr-4">
                    {/* Placeholder for avatar */}
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">{testimonial.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto divide-y divide-gray-200">
            {faqItems.map((item) => (
              <div key={item.id} className="py-5">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span className="text-lg font-semibold">{item.question}</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" width="24" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - reusing the same footer as the landing page */}
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

export default AboutPage;
