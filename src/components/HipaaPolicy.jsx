import React, { useEffect, useRef } from 'react';

const HipaaPolicy = () => {

    const topRef = useRef(null);

    useEffect(() =>{
        topRef.current?.scrollIntoView({ behavior: 'smooth'});
        window.scrollTo({ top: 0, behavior: 'smooth'});
    }, [])
  return (
    <div ref={topRef} className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">HIPAA Compliance Policy</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">SwiftlyMeds HIPAA Compliance Statement</h2>
        <p className="text-gray-700 mb-4">
          SwiftlyMeds is committed to protecting the privacy and security of our customers' protected health information (PHI) 
          in compliance with the Health Insurance Portability and Accountability Act (HIPAA) regulations. While we primarily 
          serve international customers, we maintain HIPAA standards for all health information we handle.
        </p>
      </div>

      <div className="space-y-8">
        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">1. Protected Health Information (PHI)</h3>
          <p className="text-gray-700 mb-2">
            PHI includes any information about health status, provision of healthcare, or payment for healthcare that can be 
            linked to an individual. This may include:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Patient names and contact information</li>
            <li>Medical history and prescriptions</li>
            <li>Payment and insurance information</li>
            <li>Any other identifiable health information</li>
          </ul>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">2. Our HIPAA Compliance Measures</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-blue-600">Administrative Safeguards</h4>
              <p className="text-gray-700">
                We implement policies and procedures to manage the selection, development, implementation, and maintenance 
                of security measures to protect PHI.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-600">Physical Safeguards</h4>
              <p className="text-gray-700">
                We maintain physical security of our facilities and devices that store or process PHI, including access 
                controls and workstation security.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-600">Technical Safeguards</h4>
              <p className="text-gray-700">
                We use encryption for data in transit and at rest, implement access controls, and maintain audit logs 
                to track access to PHI.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">3. International Data Transfers</h3>
          <p className="text-gray-700 mb-2">
            While SwiftlyMeds serves customers internationally, we maintain HIPAA-compliant standards for all data 
            regardless of destination. For international transfers, we:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Use secure, encrypted channels for all data transfers</li>
            <li>Ensure our international partners maintain equivalent privacy protections</li>
            <li>Comply with all applicable international data protection laws</li>
          </ul>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">4. Patient Rights</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-blue-600">Right to Access</h4>
              <p className="text-gray-700">
                Patients may request access to their PHI that we maintain in designated record sets.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-600">Right to Amend</h4>
              <p className="text-gray-700">
                Patients may request amendments to their PHI if they believe it is incorrect or incomplete.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-600">Right to Restrict Disclosure</h4>
              <p className="text-gray-700">
                Patients may request restrictions on certain uses and disclosures of their PHI.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">5. Breach Notification</h3>
          <p className="text-gray-700">
            In the unlikely event of a breach of unsecured PHI, SwiftlyMeds will notify affected individuals, the 
            Secretary of Health and Human Services, and potentially the media as required by HIPAA rules, within the 
            required timeframes.
          </p>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">6. Contact Information</h3>
          <p className="text-gray-700">
            For questions about our HIPAA compliance or to exercise your rights regarding your PHI, please contact our 
            Privacy Officer:
          </p>
          <div className="mt-3 p-4 bg-white rounded-md">
            <p className="font-medium">SwiftlyMeds Privacy Officer</p>
            <p>Email: privacy@swiftlymeds.com</p>
            <p>Phone: [Your Contact Number]</p>
            <p>Address: [Your Company Address]</p>
          </div>
          <p className="text-gray-700 mt-3">
            This policy was last updated on [Insert Date] and may be updated periodically to reflect changes in our 
            practices or applicable laws.
          </p>
        </section>
      </div>
    </div>
  );
};

export default HipaaPolicy;