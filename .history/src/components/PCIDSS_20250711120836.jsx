import { FaShieldAlt, FaLock, FaServer, FaEyeSlash, FaSyncAlt, FaCheckCircle } from 'react-icons/fa';

const PciDssCompliance = () => {
     useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center justify-center bg-blue-100 rounded-full p-4 mb-6">
          <FaShieldAlt className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          PCI DSS Compliance
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our platform is built on PCI DSS Level 1 compliant AWS infrastructure with 
          rigorous security measures to protect your payment data.
        </p>
      </div>

      {/* Compliance Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <FaServer className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">AWS Infrastructure</h3>
              </div>
              <p className="text-gray-600">
                Our application is built exclusively on PCI-eligible AWS services, 
                leveraging Amazon's PCI DSS Level 1 compliant infrastructure.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaLock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Data Encryption</h3>
              </div>
              <p className="text-gray-600">
                All payment data is encrypted both in transit and at rest using 
                industry-standard encryption protocols to ensure maximum security.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <FaEyeSlash className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Access Control</h3>
              </div>
              <p className="text-gray-600">
                Strict access controls are implemented following the principle of 
                least privilege, ensuring only authorized personnel can access sensitive data.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <FaCheckCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Secure Configurations</h3>
              </div>
              <p className="text-gray-600">
                All systems are hardened with secure configurations following AWS 
                and PCI DSS best practices to minimize vulnerabilities.
              </p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <FaSyncAlt className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Regular Scans</h3>
              </div>
              <p className="text-gray-600">
                We perform regular vulnerability scans and penetration tests to 
                identify and remediate potential security issues promptly.
              </p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <FaShieldAlt className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Ongoing Compliance</h3>
              </div>
              <p className="text-gray-600">
                Continuous monitoring and annual assessments ensure we maintain 
                compliance with the latest PCI DSS standards.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-blue-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Need More Details?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            For more information about our security practices or to request our 
            PCI DSS compliance documentation, please contact our security team.
          </p>
          <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-300">
            Contact Security Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default PciDssCompliance;