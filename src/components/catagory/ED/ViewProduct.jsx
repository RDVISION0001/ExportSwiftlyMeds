import React, { useEffect, useRef, useState } from 'react';
import { FaShoppingCart, FaHeart, FaShareAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../AuthContext/AuthContext';

const ViagraProductPage = () => {

    const topRef = useRef(null);

    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [])
    const { setProduct, setCart, setAmount, cart, product } = useAuth();
    const [selectedDosage, setSelectedDosage] = useState('100mg');
    const navigate = useNavigate();
    const dosageOptions = ['100mg', '75mg', '50mg', '25mg'];

    const pricingData = {
        '100mg': [
            { id: 1, pills: 10, perPill: '$3.61', savings: '', perPack: '$36.10' },
            { id: 2, pills: 20, perPill: '$2.27', savings: '$26.73', perPack: '$72.29' },
            { id: 3, pills: 30, perPill: '$1.83', savings: '$53.47', perPack: '$108.30' },
            { id: 4, pills: 60, perPill: '$1.38', savings: '$133.67', perPack: '$216.60' },
            { id: 5, pills: 90, perPill: '$1.23', savings: '$213.88', perPack: '$324.90' },
            { id: 6, pills: 120, perPill: '$1.16', savings: '$294.08', perPack: '$433.20' },
            { id: 7, pills: 180, perPill: '$1.09', savings: '$454.49', perPack: '$649.80' },
            { id: 8, pills: 270, perPill: '$1.04', savings: '$695.10', perPack: '$974.70' },
            { id: 9, pills: 360, perPill: '$1.01', savings: '$935.71', perPack: '$1299.60' },
        ],
        '75mg': [
            { id: 10, pills: 10, perPill: '$3.61', savings: '', perPack: '$36.10' },
            { id: 11, pills: 20, perPill: '$2.27', savings: '$26.73', perPack: '$72.29' },
            { id: 12, pills: 30, perPill: '$1.83', savings: '$53.47', perPack: '$108.30' },
            { id: 13, pills: 60, perPill: '$1.38', savings: '$133.67', perPack: '$216.60' },
            { id: 14, pills: 90, perPill: '$1.23', savings: '$213.88', perPack: '$324.90' },
        ],
        '50mg': [
            { id: 15, pills: 10, perPill: '$3.61', savings: '', perPack: '$36.10' },
            { id: 16, pills: 20, perPill: '$2.27', savings: '$26.73', perPack: '$72.29' },
            { id: 17, pills: 30, perPill: '$1.83', savings: '$53.47', perPack: '$108.30' },
            { id: 18, pills: 60, perPill: '$1.38', savings: '$133.67', perPack: '$216.60' },
        ],
        '25mg': [
            { id: 19, pills: 10, perPill: '$3.61', savings: '', perPack: '$36.10' },
            { id: 20, pills: 20, perPill: '$2.27', savings: '$26.73', perPack: '$72.29' },
            { id: 21, pills: 30, perPill: '$1.83', savings: '$53.47', perPack: '$108.30' },
        ]
    };

    const analogs = [
        'Aurogra', 'Brand Viagra', 'Caverta', 'Cenforce', 'Cenforce-D',
        'Cenforce Professional', 'Cenforce Soft', 'Eriacia', 'View all'
    ];

    const otherNames = [
        'Intagra', 'Sildenafila', 'Sildenafilo', 'Sildenafilum', 'Veega'
    ];
    const AddToCart = (data) => {
        // Set the selected product
        const perPillValue = parseFloat(data.perPill.replace('$', '')) || 0;
        const perPackValue = parseFloat(data.perPack.replace('$', '')) || 0;
        const savingsValue = parseFloat(data.savings.replace('$', '')) || 0;
    
        // Calculate the discounted price (already done in perPack)
        const discountedPrice = savingsValue > 0 ? perPackValue - savingsValue : perPackValue;
    
        // Set the selected product with formatted values
        const productToAdd = {
            id: data.id,
            dosage: selectedDosage,
            pills: data.pills,
            perPill: `$${perPillValue.toFixed(2)}`,
            perPack: `$${discountedPrice.toFixed(2)}`,
            savings: savingsValue > 0 ? `$${savingsValue.toFixed(2)}` : '',
            originalPrice: `$${perPackValue.toFixed(2)}`,
            packagePrice: discountedPrice // Add numeric value for calculations
        };
    
        setProduct(productToAdd);
    
        // Safely handle cart (initialize as array if null/undefined)
        const currentCart = Array.isArray(cart) ? cart : (cart ? [cart] : []);
    
        // Update cart
        const existingItem = currentCart.find(item => item.id === data.id && item.dosage === selectedDosage);
        let updatedCart;
    
        if (existingItem) {
            // If item exists, update quantity
            updatedCart = currentCart.map(item =>
                item.id === data.id && item.dosage === selectedDosage
                    ? { 
                        ...item, 
                        quantity: (item.quantity || 1) + 1,
                        packagePrice: discountedPrice // Update package price
                      }
                    : item
            );
        } else {
            // Add new item to cart
            updatedCart = [
                ...currentCart,
                {
                    ...productToAdd,
                    quantity: 1
                }
            ];
        }
    
        setCart(updatedCart);
    
        // Calculate total amount correctly
        const totalAmount = updatedCart.reduce((sum, item) => {
            // Use packagePrice multiplied by quantity
            return sum + (item.packagePrice * (item.quantity || 1));
        }, 0);
    
        setAmount(totalAmount.toFixed(2));
        console.log('TotalAmount', totalAmount);
    
        // Navigate to shipping page
        navigate('/shipping');
    };
    return (
        <div ref={topRef} className="max-w-6xl mx-auto px-4 py-8">
            {/* Product Header */}
            <div className='flex justify-between items-center mb-6'>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Viagra</h1>
                <button onClick={() => navigate('/CatProduct')} className='bg-[#A8F1FF] px-4 py-1 rounded-lg'>Back To shop</button>
            </div>
            <p className="text-gray-600 mb-4">
                Viagra is often the first treatment tried for erectile dysfunction in men and pulmonary arterial hypertension.
            </p>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                    <div className="flex justify-between mb-4">
                        <div>
                            <p className="font-semibold">Active Ingredient: <span className="font-normal">Sildenafil</span></p>
                            <p className="font-semibold">Availability: <span className="text-green-600">In Stock (48 Packages)</span></p>
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-2 text-gray-500 hover:text-red-500">
                                <FaHeart size={20} />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-blue-500">
                                <FaShareAlt size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Discount Banner */}
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 mb-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    <span className="font-bold">Save your money</span> - Mega Discounts on Big Packs
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Analog Products */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-2">Analogs Of Viagra:</h3>
                        <div className="flex flex-wrap gap-2">
                            {analogs.map((analog, index) => (
                                <span key={index} className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                                    {analog}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Other Names */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Other Names Of Viagra:</h3>
                        <div className="flex flex-wrap gap-2">
                            {otherNames.map((name, index) => (
                                <span key={index} className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Product Image and Strength */}
                <div className="flex flex-col items-center">
                    <div className="w-64 h-64 bg-blue-50 mb-4 rounded-lg flex items-center justify-center border border-blue-100">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-800 mb-2">Viagra</div>
                            <div className="text-xl text-blue-600">{selectedDosage}</div>
                        </div>
                    </div>

                    {/* Dosage Selector */}
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {dosageOptions.map(dosage => (
                            <button
                                key={dosage}
                                onClick={() => setSelectedDosage(dosage)}
                                className={`px-4 py-2 rounded-md ${selectedDosage === dosage
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                            >
                                {dosage}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pricing Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Per Pill</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Savings (only today)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Per Pack</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {pricingData[selectedDosage].map((row, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{row.pills} pills</td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{row.perPill}</td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                                    {row.savings && <span className="text-green-600">{row.savings}</span>}
                                </td>
                                <td className="px-6 whitespace-nowrap text-sm font-bold">
                                    <div className="flex items-center gap-2">
                                        {row.savings ? (
                                            <>
                                                <span className="text-red-500 font-medium line-through">{row.perPack}</span>
                                                <span className="">${(parseFloat(row.perPill.replace('$', '')) * row.pills).toFixed(2)}</span>
                                            </>
                                        ) : (
                                            <span className="text-gray-800">{row.perPack}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => AddToCart(row)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                                    >
                                        <FaShoppingCart className="mr-2" />
                                        ADD TO CART
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Viagra (Sildenafil Citrate) Information</h1>

                {/* Common Use Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4 border-b pb-2">Common use</h2>
                    <p className="text-gray-700 mb-4">
                        The main component of Viagra is Sildenafil Citrate.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Sildenafil Citrate affects the response to sexual stimulation. It acts by enhancing smooth muscle relaxation using nitric oxide, a chemical that is normally released in response to sexual stimulation. This smooth muscle relaxation allows increased blood flow into certain areas of the penis, which leads to an erection.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Sildenafil Citrate is applied for the treatment of erectile dysfunction (impotence) in men and pulmonary arterial hypertension.
                    </p>
                    <p className="text-gray-700">
                        Sildenafil Citrate may also be used for other purposes not listed above.
                    </p>
                </div>

                {/* Dosage and Direction Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4 border-b pb-2">Dosage and direction</h2>
                    <p className="text-gray-700 mb-4">
                        Usually the recommended dose is 50 mg. It is taken approximately 0.5-1 hour before sexual activity. Do not take Viagra more than once a day.
                    </p>
                    <p className="text-gray-700 mb-4">
                        A high fat meal may delay the time of the effect of this drug.
                    </p>
                    <p className="text-gray-700">
                        Try not to eat grapefruit or drink grapefruit juice while you are being treated with Sildenafil Citrate.
                    </p>
                </div>

                {/* Precautions Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4 border-b pb-2">Precautions</h2>
                    <p className="text-gray-700">
                        Before you start taking Sildenafil Citrate, tell your doctor or pharmacist if you are allergic to it; or if you have any other allergies. Aged people may be more sensitive to the side effects of the drug.
                    </p>
                </div>

                {/* Contraindications Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4 border-b pb-2">Contraindications</h2>
                    <p className="text-gray-700 mb-4">
                        Viagra is contraindicated in patients who take another medicine to treat impotence or using a nitrate drug for chest pain or heart problems.
                    </p>
                    <p className="text-gray-700">
                        This medicine should not be taken by women and children as well as in patients with a known hypersensitivity to any component of the tablet.
                    </p>
                </div>

                {/* Possible Side Effects Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4 border-b pb-2">Possible side effect</h2>
                    <p className="text-gray-700 mb-4">
                        The most common side effects are headache, flushing, heartburn, stomach upset, nasal stuffiness, lightheadedness, dizziness or diarrhea.
                    </p>
                    <p className="text-gray-700 mb-4">
                        A serious allergic reaction to this drug is very rare, but seek immediate medical help if it occurs.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Many people who use this medicine do not have serious side effects.
                    </p>
                    <p className="text-gray-700">
                        In case you notice any side effects not listed above, contact your doctor or pharmacist.
                    </p>
                </div>

                {/* Drug Interaction Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4 border-b pb-2">Drug interaction</h2>
                    <p className="text-gray-700 mb-4">
                        This drug should not be used with nitrates and recreational drugs called "poppers" containing amyl or butyl nitrite; alpha-blocker medications; other medications for impotence; high blood pressure medicines, etc.
                    </p>
                    <p className="text-gray-700">
                        Consult your doctor or pharmacist for more details.
                    </p>
                </div>

                {/* Missed Dose Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4 border-b pb-2">Missed dose</h2>
                    <p className="text-gray-700">
                        Viagra is used as needed, so you are unlikely to be on a dosing schedule.
                    </p>
                </div>

                {/* Overdose Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4 border-b pb-2">Overdose</h2>
                    <p className="text-gray-700">
                        If you think you have used too much of this medicine seek emergency medical attention right away. The symptoms of overdose usually include chest pain, nausea, irregular heartbeat, and feeling light-headed or fainting.
                    </p>
                </div>

                {/* Storage Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4 border-b pb-2">Storage</h2>
                    <p className="text-gray-700">
                        Store your medicines at room temperature between 68-77 degrees F (20-25 degrees C) away from light and moisture. Do not store the drugs in the bathroom. Keep all drugs away from reach of children and pets.
                    </p>
                </div>

                {/* Disclaimer Section */}
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Disclaimer</h2>
                    <p className="text-gray-700">
                        We provide only general information about medications which does not cover all directions, possible drug integrations, or precautions. Information at the site cannot be used for self-treatment and self-diagnosis. Any specific instructions for a particular patient should be agreed with your health care adviser or doctor in charge of the case. We disclaim reliability of this information and mistakes it could contain. We are not responsible for any direct, indirect, special or other indirect damage as a result of any use of the information on this site and also for consequences of self-treatment.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ViagraProductPage;    