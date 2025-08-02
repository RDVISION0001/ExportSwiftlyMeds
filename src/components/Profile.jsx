import React, { useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { FiUser, FiMail, FiPhone, FiLogOut,  } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';


function ProfileWithOrders({ onClose, editeOpen }) {
    const { user, logout,updatedData } = useAuth();   
    if (!user) {
        return null; // or return <LoadingSpinner />;
    }
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
        <div className="max-w-2xl mx-auto p-6">
            <>
                <div className="space-y-6">
                    {rows.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex flex-col justify-center">
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

                <div className='flex justify-center items-center gap-2 mt-8'>
                    <button
                        onClick={logout}
                        className=" cursor-pointer flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-md transition-colors duration-200"
                    >
                        <FiLogOut className="mr-2" />
                        Logout
                    </button>
                    <button onClick={() => {onClose(false) , editeOpen(true)}} className='bg-green-400 text-white rounded-md py-2 px-3 font-bold cursor-pointer'>EditeProfile</button>
                </div>
            </>

        </div>
    );
}

export default ProfileWithOrders;