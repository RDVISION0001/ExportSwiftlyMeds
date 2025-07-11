import { FaShieldAlt, FaLock, FaServer, FaEyeSlash, FaSyncAlt, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Animation variants
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const PciDssCompliance = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Hero Section with Animation */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
            >
                <motion.div
                    animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1.1, 1]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    className="inline-flex items-center justify-center bg-blue-100 rounded-full p-4 mb-6"
                >
                    <FaShieldAlt className="h-10 w-10 text-blue-600" />
                </motion.div>
                <h1 className="text-xl md:text-5xl font-bold text-gray-900 mb-6">
                    PCI DSS Compliance
                </h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="text-sm md:text-xl text-gray-600 max-w-3xl mx-auto"
                >
                    Our platform is built on PCI DSS Level 1 compliant AWS infrastructure with
                    rigorous security measures to protect your payment data.
                </motion.p>
            </motion.div>

            {/* Compliance Details with Staggered Animation */}
            <motion.div
                variants={container}
                initial="hidden"
                animate={isVisible ? "show" : "hidden"}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
            >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <motion.div
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="bg-green-100 p-3 rounded-full mr-4"
                                >
                                    <FaServer className="h-6 w-6 text-green-600" />
                                </motion.div>
                                <h3 className="text-sm md:text-xl font-semibold text-gray-800">AWS Infrastructure</h3>
                            </div>
                            <p className="text-gray-600 text-xs md:text-[15px] ">
                                Our application is built exclusively on PCI-eligible AWS services,
                                leveraging Amazon's PCI DSS Level 1 compliant infrastructure.
                            </p>
                        </div>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="bg-blue-100 p-3 rounded-full mr-4"
                                >
                                    <FaLock className="h-6 w-6 text-blue-600" />
                                </motion.div>
                                <h3 className="text-sm md:text-xl font-semibold text-gray-800">Data Encryption</h3>
                            </div>
                            <p className="text-gray-600 text-xs md:text-[15px] ">
                                All payment data is encrypted both in transit and at rest using
                                industry-standard encryption protocols to ensure maximum security.
                            </p>
                        </div>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <motion.div
                                    animate={{ opacity: [1, 0.7, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="bg-purple-100 p-3 rounded-full mr-4"
                                >
                                    <FaEyeSlash className="h-6 w-6 text-purple-600" />
                                </motion.div>
                                <h3 className="text-sm md:text-xl font-semibold text-gray-800">Access Control</h3>
                            </div>
                            <p className="text-gray-600 text-xs md:text-[15px] ">
                                Strict access controls are implemented following the principle of
                                least privilege, ensuring only authorized personnel can access sensitive data.
                            </p>
                        </div>
                    </motion.div>

                    {/* Card 4 */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    className="bg-yellow-100 p-3 rounded-full mr-4"
                                >
                                    <FaCheckCircle className="h-6 w-6 text-yellow-600" />
                                </motion.div>
                                <h3 className="text-sm md:text-xl font-semibold text-gray-800">Secure Configurations</h3>
                            </div>
                            <p className="text-gray-600 text-xs md:text-[15px] ">
                                All systems are hardened with secure configurations following AWS
                                and PCI DSS best practices to minimize vulnerabilities.
                            </p>
                        </div>
                    </motion.div>

                    {/* Card 5 */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <motion.div
                                    animate={{ x: [-3, 3, -3] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="bg-red-100 p-3 rounded-full mr-4"
                                >
                                    <FaSyncAlt className="h-6 w-6 text-red-600" />
                                </motion.div>
                                <h3 className="text-sm md:text-xl font-semibold text-gray-800">Regular Scans</h3>
                            </div>
                            <p className="text-gray-600 text-xs md:text-[15px] ">
                                We perform regular vulnerability scans and penetration tests to
                                identify and remediate potential security issues promptly.
                            </p>
                        </div>
                    </motion.div>

                    {/* Card 6 */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="bg-indigo-100 p-3 rounded-full mr-4"
                                >
                                    <FaShieldAlt className="h-6 w-6 text-indigo-600" />
                                </motion.div>
                                <h3 className="text-sm md:text-xl font-semibold text-gray-800">Ongoing Compliance</h3>
                            </div>
                            <p className="text-gray-600">
                                Continuous monitoring and annual assessments ensure we maintain
                                compliance with the latest PCI DSS standards.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* CTA Section with Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-16 bg-blue-400 rounded-xl p-8 text-center text-white"
                >
                    <h2 className="text-xl md:text-3xl font-bold mb-4">Need More Details?</h2>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-sm md:text-[15px]">
                        For more information about our security practices or to request our
                        PCI DSS compliance documentation, please contact our security team.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-300 tex "
                    >
                        Contact Security Team
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PciDssCompliance;