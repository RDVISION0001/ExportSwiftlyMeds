import React, { useEffect, useRef } from 'react';
import privacy from '../assets/privacy.jpg';

const PrivacyPolicy = () => {

  const topRef = useRef(null);

  useEffect(() =>{

    topRef.current?.scrollIntoView({ behavior: 'smooth'});
    window.scrollTo({ top: 0, behavior: 'smooth'});
  }, [])
  return (
    <div ref={topRef} className="max-w-4xl mx-auto px-4 py-8 font-sans text-gray-800">
      <div>
        <img src={privacy} alt="" className='rounded-lg mb-4'/>
      </div>
      {/* Header */}
      <div className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold mb-2">Your Privacy – Our Commitment</h1>
        <p className="text-lg">
          Welcome to www.swiftlymeds.com ("SwiftlyMeds", "Website", "Pharmacy", "us" or "we"). This Website/App is managed and operated by Swiftly Meds Private Limited, a company incorporated under the Companies Act, 2013, with its registered office at:
        </p>
        <div className="mt-4 bg-gray-50 p-4 rounded-md">
          <p>SA20/205-H-6-K, Chandra Chaurah, Ashapur, Varanasi, Varanasi – 221007, Uttar Pradesh, India.</p>
          <p>CIN: U21001UP2024PTC211871</p>
        </div>
      </div>

      {/* Policy Sections */}
      <div className="space-y-8">
        {/* Section 1 */}
        <div>
          <h2 className="text-2xl font-semibold mb-3">1. General</h2>
          <p>
            This Privacy Policy, together with our Terms and Conditions, governs your use of the Website and describes how we collect, use, disclose, process, transfer, and store your personal information. By accessing or using the Website, you consent to the practices described in this Privacy Policy.
          </p>
        </div>

        {/* Section 2 */}
        <div>
          <h2 className="text-2xl font-semibold mb-3">2. Type of Information Collected</h2>
          <p className="mb-2">We may collect and process:</p>
          <p className="font-medium mb-1">Personal Information: Name, email, phone number, mailing address, gender, date of birth, contact preferences, etc.</p>
          <p className="font-medium">Sensitive Personal Data or Information (SPDI):</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Passwords</li>
            <li>Financial data (credit/debit card info, bank details)</li>
            <li>Health data (physical, physiological, or mental conditions)</li>
            <li>Biometric information</li>
            <li>Any information required for service provision</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div>
          <h2 className="text-2xl font-semibold mb-3">3. Use of Information</h2>
          <p>We use the information to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Provide access to your account</li>
            <li>Improve services and user experience</li>
            <li>Process orders and payments</li>
            <li>Send updates, invoices, alerts, and promotional content</li>
            <li>Ensure legal and regulatory compliance</li>
            <li>Address disputes and detect fraudulent activities</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div>
          <h2 className="text-2xl font-semibold mb-3">4. Disclosure of Information</h2>
          <p>Your data may be shared with:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Trusted third-party service providers (e.g., payment gateways)</li>
            <li>Government or regulatory authorities when legally required</li>
            <li>Other entities during merger, acquisition, or business restructuring</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div>
          <h2 className="text-2xl font-semibold mb-3">5. Security</h2>
          <p>
            We implement appropriate security measures such as encryption, firewalls, and limited access controls to protect your information. However, due to the nature of the internet, we cannot guarantee complete security and disclaim liability for breaches beyond our control.
          </p>
        </div>

        {/* Section 6 */}
        <div>
          <h2 className="text-2xl font-semibold mb-3">6. Cookies</h2>
          <p>
            We use cookies and similar technologies to collect non-personal usage data. These help us enhance user experience and analyze site traffic. You may disable cookies through your browser settings.
          </p>
        </div>

        {/* Section 7 */}
        <div>
          <h2 className="text-2xl font-semibold mb-3">7. Opt-Out</h2>
          <p>
            You can opt out of non-essential promotional communication by clicking "unsubscribe" in our emails or contacting us at cs@swiftlymeds.com.
          </p>
        </div>

        {/* Section 8 */}
        <div>
          <h2 className="text-2xl font-semibold mb-3">8. Retention</h2>
          <p>
            We retain your data as long as necessary to fulfill the purposes outlined in this policy unless a longer period is required by law.
          </p>
        </div>

        {/* Section 9 */}
        <div>
          <h2 className="text-2xl font-semibold mb-3">9. Changes to Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The latest version will always be available on our Website. We encourage you to review it regularly.
          </p>
        </div>

        {/* Section 10 */}
        <div className="bg-gray-50 p-6 rounded-md">
          <h2 className="text-2xl font-semibold mb-3">10. Grievance Redressal</h2>
          <p className="mb-4">
            If you have any questions or complaints, you may contact our Grievance Officer:
          </p>
          <div className="bg-white p-4 rounded-md">
            <p><span className="font-medium">Name:</span>Mr. Santosh</p>
            <p><span className="font-medium">Designation:</span> Grievance Officer</p>
            <p><span className="font-medium">Email:</span> info@swiftlymeds.com</p>
            <p><span className="font-medium">Contact:</span> 088580 43370</p>
          </div>
        </div>

        {/* Section 11 */}
        <div>
          <h2 className="text-2xl font-semibold mb-3">11. Governing Law</h2>
          <p>
            This Privacy Policy is governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Varanasi, Uttar Pradesh.
          </p>
        </div>

        {/* Section 12 */}
        <div>
          <h2 className="text-2xl font-semibold mb-3">12. Severability</h2>
          <p>
            If any provision of this Privacy Policy is held invalid, the remaining provisions shall remain in full force and effect.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;