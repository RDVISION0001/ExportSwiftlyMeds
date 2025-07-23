import React, { useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { FiUser, FiMail, FiPhone, FiKey, FiClock, FiLogOut, FiCheckCircle, FiXCircle, FiShoppingBag } from 'react-icons/fi';
import { MdVerified, MdOutlinePending } from 'react-icons/md';
import Order from './Order';

function ProfileWithOrders({ onClose }) {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    // Return null or a loading spinner if user is not available
    if (!user) {
        return null; // or return <LoadingSpinner />;
    }

    const getStatusIcon = () => {
        switch (user.status) {
            case 'active':
                return <FiCheckCircle className="text-green-500" />;
            case 'pending':
                return <MdOutlinePending className="text-yellow-500" />;
            case 'inactive':
                return <FiXCircle className="text-red-500" />;
            default:
                return null;
        }
    };

    const profileItems = [
        {
            icon: <FiUser className="text-blue-600" />,
            title: "Full Name",
            value: user.swiftUserName || 'Not provided',
            bgColor: "bg-blue-100"
        },
        {
            icon: <FiMail className="text-green-600" />,
            title: "Email",
            value: user.swiftUserEmail || 'Not provided',
            extra: user.isVerified && (
                <div className="flex items-center mt-1 text-sm text-green-600">
                    <MdVerified size={16} className="mr-1" />
                    <span>Verified</span>
                </div>
            ),
            bgColor: "bg-green-100"
        },
        {
            icon: <FiPhone className="text-purple-600" />,
            title: "Phone",
            value: user.swiftUserPhone || 'Not provided',
            bgColor: "bg-purple-100"
        },

    ];






    // Split items into groups of 3 for each row
    const rows = [];
    for (let i = 0; i < profileItems.length; i += 3) {
        rows.push(profileItems.slice(i, i + 3));
    }

    return (
        <div className="w-full p-6 bg-white ">
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`py-2 px-4  cursor-pointer font-medium text-sm flex items-center ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <FiUser className="mr-2" />
                    Profile
                </button>
                <button
                    className={`py-2 px-4 cursor-pointer  font-medium text-sm flex items-center ${activeTab === 'orders' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('orders')}
                >
                    <FiShoppingBag className="mr-2" />
                    Orders
                </button>
            </div>

            {/* Profile Tab Content */}
            {activeTab === 'profile' && (
                <>
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                            {user.swiftUserName?.charAt(0) || 'U'}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
                        {user.status && (
                            <div className="flex items-center mt-2 text-sm font-medium">
                                {getStatusIcon()}
                                <span className="ml-2 capitalize">{user.status}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {rows.map((row, rowIndex) => (
                            <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {row.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex items-start">
                                        <div className={`p-2 mr-3 ${item.bgColor} rounded-lg`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">{item.title}</p>
                                            <p className="text-lg text-gray-800">{item.value}</p>
                                            {item.extra}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className='flex justify-center'>
                        <button
                            onClick={logout}
                            className="mt-8 cursor-pointer flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                        >
                            <FiLogOut className="mr-2" />
                            Logout
                        </button>
                    </div>
                </>
            )}

            {/* Orders Tab Content */}
            {activeTab === 'orders' && (
                <Order onClose={onClose} />
            )}
        </div>
    );
}

export default ProfileWithOrders;