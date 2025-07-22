import React, { useEffect, useRef } from 'react';

const CareersPage = () => {
  const jobOpenings = [
    {
      id: 1,
      title: 'Frontend Developer',
      department: 'Engineering',
      type: 'Full-time',
      location: 'Remote',
      description: 'We are looking for a skilled Frontend Developer to join our team...'
    },
    {
      id: 2,
      title: 'UX Designer',
      department: 'Design',
      type: 'Full-time',
      location: 'San Francisco, CA',
      description: 'Join our design team to create amazing user experiences...'
    },
    {
      id: 3,
      title: 'Backend Engineer',
      department: 'Engineering',
      type: 'Contract',
      location: 'Remote',
      description: 'Looking for a backend engineer to help scale our infrastructure...'
    }
  ];

  const benefits = [
    'Competitive salary and equity',
    'Health, dental, and vision insurance',
    'Flexible work hours',
    'Remote work options',
    'Professional development budget',
    'Generous vacation policy'
  ];


  const topRef = useRef(null);

  useEffect(() =>{
    topRef.current?.scrollIntoView({ behavior: 'smooth'});
    window.scrollTo({ top: 0, behavior: 'smooth'});
  }, [])
  return (
    <div ref={topRef} className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Help us build the future while doing the best work of your career.
          </p>
          <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-300">
            View Open Positions
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Work With Us</h2>
              <p className="text-gray-600 mb-6">
                At our company, we're committed to creating an inclusive environment where diverse
                perspectives thrive and everyone can bring their authentic selves to work.
              </p>
              <p className="text-gray-600">
                We believe that great ideas can come from anywhere, and we're dedicated to helping
                each team member grow both professionally and personally.
              </p>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c" 
                alt="Team working together" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="text-blue-600 mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{benefit}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Openings Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Current Openings</h2>
          <div className="max-w-4xl mx-auto">
            {jobOpenings.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-6 mb-6 hover:shadow-md transition duration-300">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                    <div className="flex flex-wrap mt-2">
                      <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full mr-2 mb-2">
                        {job.department}
                      </span>
                      <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full mr-2 mb-2">
                        {job.type}
                      </span>
                      <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full mr-2 mb-2">
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-300">
                    Apply Now
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-gray-600">{job.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Culture Section */}
      <div className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644" 
                alt="Company culture" 
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Culture</h2>
              <p className="text-gray-300 mb-6">
                We foster a culture of collaboration, innovation, and continuous learning. Our team
                members are passionate about what they do and support each other in achieving both
                personal and professional goals.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Team Events</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Mentorship</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Growth Opportunities</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Work-Life Balance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Don't See Your Dream Job?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            We're always looking for talented people to join our team. Send us your resume and we'll
            contact you when a position becomes available.
          </p>
          <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-300">
            Submit Your Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;