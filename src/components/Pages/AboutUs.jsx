import React from 'react'
import about from "../../assets/about.png";

function AboutUs() {
    return (
        <div className='w-full'>
            <div
                style={{
                    backgroundImage: `url(${about})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
                className='min-h-[400px] md:min-h-[500px] lg:min-h-[600px] w-full flex items-center justify-center px-4 py-16'
            >
                <h2 className='text-[#1E201E] text-xl md:text-4xl font-bold'> Empowering lives through timely access to care—one day at a time.</h2>
            </div>
            <div className='w-full max-w-7xl mx-auto py-10'>
                <h2 className='text-center font-bold text-xl md:text-4xl'>About Us</h2>
                <div className='mt-4 text-center text-gray-800 space-y-4'>
                    <p>
                        At SwiftlyMeds.com, we are committed to providing global access to essential wellness solutions, prioritizing affordability, quality, and compassionate care. As a trusted online pharmacy and international distributor, our mission is to ensure individuals worldwide can conveniently access the medications they need for their health and well-being—without financial barriers.
                    </p>

                    <p>
                        Our dedicated team of licensed healthcare professionals and pharmacy experts brings deep industry knowledge to create an efficient, reliable, and cost-effective global delivery system. We've streamlined our operations to reduce costs while maintaining strict quality standards, ensuring consistent access to vital medications.
                    </p>

                    <p>
                        We leverage cutting-edge technology and innovative solutions to make healthcare more accessible. Our platform offers discreet, FDA-approved medications with fast international shipping, supporting patients facing various health challenges.
                    </p>

                    <p>
                        At SwiftlyMeds.com, we're more than just an online pharmacy—we're your partner in health, building trust through transparent practices, exceptional customer care, and reliable access to affordable medications worldwide.
                    </p>
                </div>
            </div>
            <div className='w-full bg-'>

            </div>
        </div>
    )
}

export default AboutUs