import React from 'react'
import natco from '../../assets/Brand/Natco.jpg';
import biocon from '../../assets/Brand/Biocon.jpg';
import emcure from '../../assets/Brand/emcure.jpg';
import cipla from '../../assets/Brand/Cipla.jpg';
import hetro from '../../assets/Brand/Hetero.jpg';
import roche from '../../assets/Brand/Roche.jpg';

function Home2() {

    const benefits = [
        {
            title: "Worldwide Shipping",
            description: "Get your medicine delivered to the desired destination on timely and safely.",
            icon: (
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z" />
                </svg>
            )
        },
        {
            title: "24x7 Customer Support",
            description: "Our expert customer support team available 24x7 for quick response.",
            icon: (
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
            )
        },
        {
            title: "Goodwill and Care",
            description: "We care not only quality of drugs but also quality of customer service.",
            icon: (
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            )
        },
        {
            title: "100% Quality & Certified Products",
            description: "All unprecedented generic products are 100% quality approved products.", //change by maneger sir product to products
            icon: (
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z" />
                </svg>
            )
        },
        {
            title: "Lowest Price Guarantee",
            description: "Assurance of best price on all generic medicines.",
            icon: (
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                </svg>
            )
        },
        {
            title: "Money Back Guarantee",
            description: "100% money back guarantee on all lost or returned parcels.",
            icon: (
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                </svg>
            )
        }
    ];
    const brand = [
        { image: natco },
        { image: biocon },
        { image: emcure },
        { image: cipla },
        { image: hetro },
        { image: roche },
    ]

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">WHY CHOOSE US?</h2>
                <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                    <div
                        key={index}
                        className="bg-gray-100 p-8 rounded-lg shadow-md hover:shadow-xl duration-300 hover:-translate-y-2 transition-transform"
                    >
                        <div className="text-blue-500 mb-6">
                            {benefit.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">{benefit.title}</h3>
                        <p className="text-gray-600">{benefit.description}</p>
                    </div>
                ))}
            </div>
            <div className='py-20'>
                <h2 className='text-4xl font-bold text-gray-800 mb-4 text-center'>Our Valuable Brand</h2>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 space-x-10 '>
                    {brand.map((img, index) => (
                        <div key={index}
                            className="bg-white shadow-xl rounded-lg p-4 cursor-pointer mt-10 
                  transition-all duration-300 ease-in-out 
                  hover:shadow-2xl hover:scale-[1.02] hover:border hover:border-blue-100
                  transform-gpu"
                        >
                            <img
                                src={img.image}
                                alt={img.alt || "Product image"}
                                className="w-40 h-auto object-contain transition-opacity duration-300 hover:opacity-90"
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-gray-50 p-6 md:p-8 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-bold mb-4">MEDICAL DISCLAIMER</h2>
                <p className="mb-4">
                    <strong>Swiftly Meds Private Limited</strong> only expresses opinions and provides information.
                    All Trademarks, Brands and Service marks that appear on this website belong to their respective owners.
                </p>
                <p className="mb-4">
                    We do not recommend any drug or give medical advice. Whether a medication is right for you
                    is a decision between you and the prescribing doctor. The content of this site should not be
                    a substitute for professional medical advice, diagnosis or any treatment.
                </p>
                <p>
                    Above information is meant for: Wholesalers, Suppliers, Doctors, Hospitals, Clinics,
                    Resellers, Medical Institutions and Pharmacies.
                </p>
            </div>
        </section>
    )
}

export default Home2