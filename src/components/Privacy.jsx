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
          <p>
         <strong>1.</strong> Is your company registered with the Drug Controller General of India (DCGI)?
          </p>
        </div>

        {/* Section 2 */}
        <div>
          <p className="mb-2"><strong>2.</strong> Do you have documentation of an Importer Exporter Code (IEC) from the Indian Directorate General of Foreign Trade (DGFT)?</p>
        </div>

        {/* Section 3 */}
        <div>
        <p className="mb-2"><strong>3.</strong>  Do you have product registration information for every single product available on your website.</p>
        </div>

        {/* Section 4 */}
        <div>
        <p className="mb-2"><strong>4.</strong> Who exactly are you selling to? Individuals, wholesalers, manufacturers, retailers, etc.</p>
        </div>

        {/* Section 5 */}
        <div>
        <p className="mb-2"><strong>5.</strong> Which exact jurisdictions is your business operating in?</p>
        </div>

        {/* Section 6 */}
        <div>
        <p className="mb-2"><strong>6.</strong> Who are you obtaining the medicines from (which manufacturers)?</p>
        </div>

        {/* Section 7 */}
        <div>
        <p className="mb-2"><strong>7.</strong> Please provide a detailed explanation of how it is legal to export medicines from India to countries like the US where those specific medicines are not approved by the relevant regulatory body (in this case the FDA). Your Terms and Conditions page on your website explicitly states "Most of Generic Medicines exported from India are not registered under FDA resulting non clearance at the customs. Respective Business or Individual needs to make sure that they are well aware of the rules and regulation of their countries in order to receive goods from different countries including India in order to keep transaction smooth."</p>
        </div>

        {/* Section 8 */}
        <div>
        <p className="mb-2"><strong>8.</strong> Please provide an explanation (with regulatory citations) for every single country where you offer to export medications.q</p>
        </div>

        {/* Section 9 */}
        <div>
        <p className="mb-2"><strong>9.</strong> Please provide a detailed explanation of legal compliance and documentation of all necessary import authorizations required by each country you're shipping to.</p>
        </div>

        {/* Section 10 */}
        <div>
        <p className="mb-2"><strong>10.</strong> Your website indicates your business is an online pharmacy and a pharmaceutical exporter. Please clarify which one switflymeds.com is?</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;