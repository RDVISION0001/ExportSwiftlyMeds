import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import axiosInstance from '../AuthContext/AxiosInstance';
import { FiDownload, FiRotateCw, FiZoomIn, FiZoomOut, FiX, FiImage } from 'react-icons/fi';
import { motion } from 'framer-motion';

function AllPrescription() {
    const { token } = useAuth();
    const [prescriptionData, setPrescriptionData] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllPrescription();
    }, []);

    const getAllPrescription = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/swift/cart/prescriptions`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPrescriptionData(response.data.data.reverse());
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setZoomLevel(1);
        setRotation(0);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    const zoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.25, 3));
    };

    const zoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
    };

    const rotateImage = () => {
        setRotation(prev => (prev + 90) % 360);
    };

    const downloadImage = () => {
        if (!selectedImage) return;

        const link = document.createElement('a');
        link.href = selectedImage;
        link.download = `prescription-${new Date().toISOString().slice(0, 10)}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                My Prescriptions
                <span className="badge badge-soft badge-info text-sm font-semibold px-1 py-0.5 rounded-full">
                    {prescriptionData.length}
                </span>
            </h1>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : prescriptionData.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No prescriptions found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {prescriptionData?.map((prescription, index) => (
                        <motion.div
                            key={prescription.curoPrescriptionId}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => openImageModal(prescription.s3Url)}
                        >
                            <div className="h-40 bg-gray-100 flex items-center justify-center">
                                {prescription.s3Url ? (
                                    <img
                                        src={prescription.s3Url}
                                        alt="Prescription"
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <FiImage className="text-gray-400 text-4xl" />
                                )}
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-gray-600">
                                    Uploaded: {formatDate(prescription.uploadedAt)}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Image Modal */}
            {selectedImage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4"
                    onClick={closeImageModal}
                >
                    <div className="relative max-w-6xl w-full max-h-screen">
                        <motion.div
                            className="bg-white rounded-lg overflow-hidden shadow-xl"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-4 right-4 flex space-x-2 z-10">
                                <button
                                    onClick={zoomIn}
                                    className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
                                    title="Zoom In"
                                >
                                    <FiZoomIn size={20} />
                                </button>

                                <button
                                    onClick={zoomOut}
                                    className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
                                    title="Zoom Out"
                                >
                                    <FiZoomOut size={20} />
                                </button>

                                <button
                                    onClick={rotateImage}
                                    className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
                                    title="Rotate"
                                >
                                    <FiRotateCw size={20} />
                                </button>

                                <button
                                    onClick={downloadImage}
                                    className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
                                    title="Download"
                                >
                                    <FiDownload size={20} />
                                </button>

                                <button
                                    onClick={closeImageModal}
                                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors cursor-pointer"
                                    title="Close"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            <div className="p-4 max-h-[80vh] overflow-auto flex items-center justify-center">
                                <img
                                    src={selectedImage}
                                    alt="Prescription"
                                    className="max-w-full max-h-[70vh] object-contain transition-transform duration-300"
                                    style={{
                                        transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                                    }}
                                />
                            </div>

                            <div className="bg-gray-100 px-4 py-3 flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                    Zoom: {Math.round(zoomLevel * 100)}% | Rotation: {rotation}°
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default AllPrescription;