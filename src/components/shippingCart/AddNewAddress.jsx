import React, { useEffect, useState } from 'react';
import {
    FiCheck,
    FiPlus,
    FiPhone,
    FiEdit2,
    FiTrash2
} from 'react-icons/fi';
import { useAuth } from '../../AuthContext/AuthContext';
import axiosInstance from '../../AuthContext/AxiosInstance';
import Swal from 'sweetalert2';

function AddNewAddress({ onClose }) {
    const { token, refresh, setRefresh, user } = useAuth();
    const [selectedOption, setSelectedOption] = useState('existing');
    const [openModal, setOpenModal] = useState(false);
    const [editAddressId, setEditAddressId] = useState(null);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        addressType: '',
        fullName: '',
        addressLine: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'United States',
        phone: '',
        isDefault: false,
    });

    const formatAddressPayload = (data) => ({
        addressLine: data.addressLine,
        addressLine2: data.addressLine2 || null,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        country: data.country,
        addressType: data.addressType,
        phone: data.phone || null,
        isDefault: data.isDefault,
        user: {
            swiftUserName: user?.username || '',
        },
    });

    const fetchSavedAddresses = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('/swift/cart/address/list', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSavedAddresses(response.data);
            const defaultAddress = response.data.find((addr) => addr.isDefault);
            if (defaultAddress && selectedOption === 'existing') {
                setFormData({
                    ...defaultAddress,
                    addressLine: defaultAddress.addressLine,
                    pincode: defaultAddress.pincode,
                    phone: defaultAddress.phone || '',
                    isDefault: false,
                });
            }
        } catch (error) {
            console.error('Error fetching saved addresses:', error);
            Swal.fire('Error', 'Failed to load saved addresses. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetDefaultAddress = async (addressId) => {
        try {
            await axiosInstance.put(
                `/swift/cart/address/set-default/${addressId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            await fetchSavedAddresses();
            Swal.fire('Success', 'Default address updated successfully.', 'success');
        } catch (error) {
            console.error('Error setting default address:', error);
            Swal.fire('Error', 'Failed to set default address. Please try again.', 'error');
        }
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
        if (option === 'existing') {
            const defaultAddress = savedAddresses.find((addr) => addr.isDefault);
            if (defaultAddress) {
                setFormData({
                    ...defaultAddress,
                    addressLine: defaultAddress.addressLine,
                    pincode: defaultAddress.pincode,
                    phone: defaultAddress.phone || '',
                    isDefault: false,
                });
            } else {
                resetForm();
            }
        } else {
            resetForm();
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const resetForm = () => {
        setFormData({
            addressType: '',
            fullName: '',
            addressLine: '',
            addressLine2: '',
            city: '',
            state: '',
            pincode: '',
            country: 'United States',
            phone: '',
            isDefault: false,
        });
        setEditAddressId(null);
    };

    const handleAddressSelect = (address) => {
        setFormData({
            ...address,
            addressLine: address.addressLine,
            pincode: address.pincode,
            phone: address.phone || '',
            isDefault: false,
        });
        setSelectedOption('existing');
        setEditAddressId(null);
        setOpenModal(false);
    };

    const handleEditAddress = (address) => {
        console.log(address);
        setFormData({
            ...address,
            addressType: address.addressType.toLowerCase(), // Convert to lowercase if needed
            fullName: address.fullName || '',
            addressLine: address.addressLine || '',
            addressLine2: address.addressLine2 || '',
            city: address.city || '',
            state: address.state || '',
            pincode: address.pincode || '',
            country: address.country || 'United States',
            phone: address.phone || '',
            isDefault: address.isDefault || false,
        });
        setSelectedOption('new');
        setEditAddressId(address.id);
    };

    const handleDeleteAddress = async (id) => {
        // Check if address is default
        if (savedAddresses.find((addr) => addr.id === id)?.isDefault) {
            Swal.fire('Error', 'Cannot delete default address. Set another address as default first.', 'error');
            return;
        }

        // Show confirmation dialog
        const result = await Swal.fire({
            title: 'Delete Address?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            // Show loading modal
            Swal.fire({
                title: 'Please wait...',
                html: 'Deleting address',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                // Perform delete operation
                await axiosInstance.delete(`/swift/cart/address/delete/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Refresh addresses
                await fetchSavedAddresses();

                // Reset form if editing the deleted address
                if (editAddressId === id) {
                    resetForm();
                }

                // Close loading modal and show success
                Swal.fire({
                    title: 'Success',
                    text: 'Address deleted successfully.',
                    icon: 'success'
                });
            } catch (error) {
                console.error('Error deleting address:', error);
                // Close loading modal and show error
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to delete address. Please try again.',
                    icon: 'error'
                });
            }
        }
    };

    const handleSubmitAddress = async (e) => {
        e.preventDefault();

        // Show loading modal
        Swal.fire({
            title: 'Please wait...',
            html: 'Saving your address',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const payload = formatAddressPayload(formData);
            let response;

            if (editAddressId) {
                response = await axiosInstance.put(
                    `/swift/cart/address/update/${editAddressId}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
            } else {
                response = await axiosInstance.post(
                    '/swift/cart/address/add',
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }

            // Close loading modal
            Swal.close();

            // Show success message
            await Swal.fire({
                title: 'Success',
                text: response.data.message || (editAddressId ? 'Address updated successfully' : 'Address successfully added'),
                icon: 'success',
                confirmButtonText: 'OK',
            });

            // Refresh addresses and switch to saved addresses tab
            setSelectedOption('existing');
            await fetchSavedAddresses();
            resetForm();

        } catch (error) {
            // Close loading modal on error
            Swal.close();

            console.error('Error saving address:', error);
            const errorMessage = error.response?.data?.message || 'Failed to save address. Please try again.';
            Swal.fire({
                title: 'Error',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    useEffect(() => {
        if (token) {
            fetchSavedAddresses();
        }
    }, [token]);

    useEffect(() => {
        if (openModal && selectedOption === 'existing') {
            const defaultAddress = savedAddresses.find((addr) => addr.isDefault);
            if (defaultAddress) {
                setFormData({
                    ...defaultAddress,
                    addressLine: defaultAddress.addressLine,
                    pincode: defaultAddress.pincode,
                    phone: defaultAddress.phone || '',
                    isDefault: false,
                });
            }
        }
    }, [openModal, savedAddresses]);

    const handleSelectAddress = (address) => {
        onClose();
        handleAddressSelect(address);
    };
    const handleCloseAddNewAddress = () => {
        setSelectedOption('existing');
        resetForm();
    }

    // Loading Skeleton Component
    const AddressSkeleton = () => (
        <div className="space-y-4">
            <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((item) => (
                    <div key={item} className="border border-gray-200 rounded-lg p-4">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <div className="h-5 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="flex gap-2">
                                    <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-1/2 flex items-center gap-1 bg-gray-200 rounded animate-pulse"></div>
                            <div className="flex gap-2 pt-2">
                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div>
            <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => handleOptionChange('existing')}
                        className={`px-4 py-2 cursor-pointer rounded-md flex items-center gap-2 ${selectedOption === 'existing' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                        aria-label="Select saved addresses"
                    >
                        <FiCheck className={selectedOption === 'existing' ? 'block' : 'hidden'} />
                        Saved Addresses
                    </button>
                    <button
                        onClick={() => handleOptionChange('new')}
                        className={`px-4 py-2 cursor-pointer rounded-md flex items-center gap-2 ${selectedOption === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                        aria-label="Add new address"
                    >
                        <FiPlus className={selectedOption === 'new' ? 'block' : 'hidden'} />
                        New Address
                    </button>
                </div>

                {selectedOption === 'existing' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Select an address</h3>

                        {isLoading ? (
                            <AddressSkeleton />
                        ) : savedAddresses.length === 0 ? (
                            <p className="text-gray-500">No saved addresses found.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {savedAddresses.map((address) => (
                                    <div
                                        key={address.id}
                                        className={`border rounded-lg p-4 cursor-pointer transition-all ${address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
                                            }`}
                                        onClick={() => handleAddressSelect(address)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddressSelect(address)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium capitalize">{address.addressType}</h4>
                                                    {address.isDefault && (
                                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Default</span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 mt-1">{address.fullName}</p>
                                                <p className="text-gray-600">{address.addressLine}</p>
                                                {address.addressLine2 && <p className="text-gray-600">{address.addressLine2}</p>}
                                                <p className="text-gray-600">
                                                    {address.city}, {address.state} {address.pincode}
                                                </p>
                                                <p className="text-gray-600">{address.country}</p>
                                                <p className="text-gray-600 mt-2 flex items-center gap-1">
                                                    <FiPhone size={14} /> {address.phone || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditAddress(address);
                                                    }}
                                                    className="text-blue-500 cursor-pointer hover:text-blue-700"
                                                    title="Edit address"
                                                    aria-label={`Edit address ${address.addressType}`}
                                                >
                                                    <FiEdit2 size={16} />
                                                </button>
                                                {!address.isDefault && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteAddress(address.id);
                                                        }}
                                                        className="text-red-500 cursor-pointer hover:text-red-700"
                                                        title="Delete address"
                                                        aria-label={`Delete address ${address.addressType}`}
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-3 flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectAddress(address);
                                                }}
                                                className="text-sm cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                                aria-label={`Select address ${address.addressType}`}
                                            >
                                                Select
                                            </button>
                                            {!address.isDefault && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSetDefaultAddress(address.id);
                                                    }}
                                                    className="text-sm cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                                                    aria-label={`Set ${address.addressType} as default address`}
                                                >
                                                    Set as Default
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {selectedOption === 'new' && (
                    <form onSubmit={handleSubmitAddress} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="addressType"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Address Type (e.g., Home, Office) *
                                </label>
                                <select
                                    id="addressType"
                                    name="addressType"
                                    value={formData.addressType}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select type</option>
                                    <option value="home">Home</option>
                                    <option value="office">Office</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="fullName"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    aria-required="true"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="addressLine"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Street Address *
                            </label>
                            <input
                                type="text"
                                id="addressLine"
                                name="addressLine"
                                value={formData.addressLine}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                aria-required="true"
                            />
                        </div>
                        

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    aria-required="true"
                                />
                            </div>

                            <div>
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                    State/Province *
                                </label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    aria-required="true"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="pincode"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    ZIP/Postal Code *
                                </label>
                                <input
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    aria-required="true"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="country"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Country *
                                </label>
                                <select
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    aria-required="true"
                                >
                                    <option value="United States">United States</option>
                                    <option value="Canada">Canada</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Australia">Australia</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    aria-required="true"
                                />
                            </div>
                        </div>

                        <div className="flex items-center pt-2">
                            <input
                                type="checkbox"
                                id="isDefault"
                                name="isDefault"
                                checked={formData.isDefault}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                aria-label="Set as default shipping address"
                            />
                            <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                                Set as default shipping address
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-6">
                            <button
                                type="button"
                                onClick={handleCloseAddNewAddress}
                                className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                aria-label="Cancel address form"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label={editAddressId ? 'Update address' : 'Save address'}
                            >
                                {editAddressId ? 'Update Address' : 'Save Address'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default AddNewAddress;