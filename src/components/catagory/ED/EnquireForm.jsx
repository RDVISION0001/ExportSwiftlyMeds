import React, { useState } from 'react';
import axiosInstance from '../../../AuthContext/AxiosInstance';
import Swal from 'sweetalert2';
import { useAuth } from '../../../AuthContext/AuthContext';

function EnquireForm({ product, onClose }) {
    const { token, user } = useAuth();
    const [countryCode, setCountryCode] = useState('')
    const [enquiryForm, setEnquiryForm] = useState({
        queryMessage: '',
        queryProductName: product?.name || '',
        senderName: user?.swiftUserName || "",
        senderMobile: user?.swiftUserPhone || "",
        senderCountryIso: '',
        senderEmail: user?.swiftUserEmail || ""
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);


    const validateForm = () => {
        const newErrors = {};

        if (!enquiryForm.senderName.trim()) newErrors.senderName = 'Name is required';

        if (!enquiryForm.senderEmail.trim()) {
            newErrors.senderEmail = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiryForm.senderEmail)) {
            newErrors.senderEmail = 'Invalid email format';
        }

        if (!enquiryForm.queryProductName.trim()) newErrors.queryProductName = 'Product name is required';

        // Mobile number validation removed
        // if (!enquiryForm.senderMobile.trim()) {
        //     newErrors.senderMobile = 'Mobile number is required';
        // } else if (!/^\d{10,15}$/.test(enquiryForm.senderMobile)) {
        //     newErrors.senderMobile = 'Invalid mobile number';
        // }

        if (!enquiryForm.queryMessage.trim()) newErrors.queryMessage = 'Message is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleChange = (e) => {
        const { id, value } = e.target;
        setEnquiryForm(prev => ({ ...prev, [id]: value }));
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: '' }));
        }
    };

    function getCountryCodeFromCallingCode(callingCode) {
        const countryCallingCodes = {
            '+93': 'AF', // Afghanistan
            '+355': 'AL', // Albania
            '+213': 'DZ', // Algeria
            '+1': 'US', // United States (shared with others)
            '+376': 'AD', // Andorra
            '+244': 'AO', // Angola
            '+54': 'AR', // Argentina
            '+374': 'AM', // Armenia
            '+297': 'AW', // Aruba
            '+61': 'AU', // Australia
            '+43': 'AT', // Austria
            '+994': 'AZ', // Azerbaijan
            '+973': 'BH', // Bahrain
            '+880': 'BD', // Bangladesh
            '+375': 'BY', // Belarus
            '+32': 'BE', // Belgium
            '+501': 'BZ', // Belize
            '+229': 'BJ', // Benin
            '+975': 'BT', // Bhutan
            '+591': 'BO', // Bolivia
            '+387': 'BA', // Bosnia and Herzegovina
            '+267': 'BW', // Botswana
            '+55': 'BR', // Brazil
            '+246': 'IO', // British Indian Ocean Territory
            '+673': 'BN', // Brunei
            '+359': 'BG', // Bulgaria
            '+226': 'BF', // Burkina Faso
            '+257': 'BI', // Burundi
            '+855': 'KH', // Cambodia
            '+237': 'CM', // Cameroon
            '+238': 'CV', // Cape Verde
            '+236': 'CF', // Central African Republic
            '+235': 'TD', // Chad
            '+56': 'CL', // Chile
            '+86': 'CN', // China
            '+57': 'CO', // Colombia
            '+269': 'KM', // Comoros
            '+682': 'CK', // Cook Islands
            '+506': 'CR', // Costa Rica
            '+385': 'HR', // Croatia
            '+53': 'CU', // Cuba
            '+599': 'CW', // Curacao
            '+357': 'CY', // Cyprus
            '+420': 'CZ', // Czech Republic
            '+243': 'CD', // Democratic Republic of the Congo
            '+45': 'DK', // Denmark
            '+253': 'DJ', // Djibouti
            '+1-767': 'DM', // Dominica
            '+1-809': 'DO', // Dominican Republic
            '+1-829': 'DO', // Dominican Republic
            '+1-849': 'DO', // Dominican Republic
            '+670': 'TL', // East Timor
            '+593': 'EC', // Ecuador
            '+20': 'EG', // Egypt
            '+503': 'SV', // El Salvador
            '+240': 'GQ', // Equatorial Guinea
            '+291': 'ER', // Eritrea
            '+372': 'EE', // Estonia
            '+251': 'ET', // Ethiopia
            '+500': 'FK', // Falkland Islands
            '+298': 'FO', // Faroe Islands
            '+679': 'FJ', // Fiji
            '+358': 'FI', // Finland
            '+33': 'FR', // France
            '+689': 'PF', // French Polynesia
            '+241': 'GA', // Gabon
            '+220': 'GM', // Gambia
            '+995': 'GE', // Georgia
            '+49': 'DE', // Germany
            '+233': 'GH', // Ghana
            '+350': 'GI', // Gibraltar
            '+30': 'GR', // Greece
            '+299': 'GL', // Greenland
            '+502': 'GT', // Guatemala
            '+224': 'GN', // Guinea
            '+245': 'GW', // Guinea-Bissau
            '+592': 'GY', // Guyana
            '+509': 'HT', // Haiti
            '+504': 'HN', // Honduras
            '+852': 'HK', // Hong Kong
            '+36': 'HU', // Hungary
            '+354': 'IS', // Iceland
            '+91': 'IN', // India
            '+62': 'ID', // Indonesia
            '+98': 'IR', // Iran
            '+964': 'IQ', // Iraq
            '+353': 'IE', // Ireland
            '+972': 'IL', // Israel
            '+39': 'IT', // Italy
            '+225': 'CI', // Ivory Coast
            '+1-876': 'JM', // Jamaica
            '+81': 'JP', // Japan
            '+962': 'JO', // Jordan
            '+7': 'RU', // Russia (shared with others)
            '+254': 'KE', // Kenya
            '+686': 'KI', // Kiribati
            '+965': 'KW', // Kuwait
            '+996': 'KG', // Kyrgyzstan
            '+856': 'LA', // Laos
            '+371': 'LV', // Latvia
            '+961': 'LB', // Lebanon
            '+266': 'LS', // Lesotho
            '+231': 'LR', // Liberia
            '+218': 'LY', // Libya
            '+423': 'LI', // Liechtenstein
            '+370': 'LT', // Lithuania
            '+352': 'LU', // Luxembourg
            '+853': 'MO', // Macau
            '+389': 'MK', // North Macedonia
            '+261': 'MG', // Madagascar
            '+265': 'MW', // Malawi
            '+60': 'MY', // Malaysia
            '+960': 'MV', // Maldives
            '+223': 'ML', // Mali
            '+356': 'MT', // Malta
            '+692': 'MH', // Marshall Islands
            '+222': 'MR', // Mauritania
            '+230': 'MU', // Mauritius
            '+262': 'RE', // Reunion
            '+52': 'MX', // Mexico
            '+691': 'FM', // Micronesia
            '+373': 'MD', // Moldova
            '+377': 'MC', // Monaco
            '+976': 'MN', // Mongolia
            '+382': 'ME', // Montenegro
            '+212': 'MA', // Morocco
            '+258': 'MZ', // Mozambique
            '+95': 'MM', // Myanmar
            '+264': 'NA', // Namibia
            '+674': 'NR', // Nauru
            '+977': 'NP', // Nepal
            '+31': 'NL', // Netherlands
            '+687': 'NC', // New Caledonia
            '+64': 'NZ', // New Zealand
            '+505': 'NI', // Nicaragua
            '+227': 'NE', // Niger
            '+234': 'NG', // Nigeria
            '+683': 'NU', // Niue
            '+850': 'KP', // North Korea
            '+47': 'NO', // Norway
            '+968': 'OM', // Oman
            '+92': 'PK', // Pakistan
            '+680': 'PW', // Palau
            '+970': 'PS', // Palestine
            '+507': 'PA', // Panama
            '+675': 'PG', // Papua New Guinea
            '+595': 'PY', // Paraguay
            '+51': 'PE', // Peru
            '+63': 'PH', // Philippines
            '+48': 'PL', // Poland
            '+351': 'PT', // Portugal
            '+974': 'QA', // Qatar
            '+242': 'CG', // Republic of the Congo
            '+40': 'RO', // Romania
            '+250': 'RW', // Rwanda
            '+590': 'BL', // Saint Barthelemy
            '+290': 'SH', // Saint Helena
            '+1-869': 'KN', // Saint Kitts and Nevis
            '+1-758': 'LC', // Saint Lucia
            '+508': 'PM', // Saint Pierre and Miquelon
            '+1-784': 'VC', // Saint Vincent and the Grenadines
            '+685': 'WS', // Samoa
            '+378': 'SM', // San Marino
            '+239': 'ST', // Sao Tome and Principe
            '+966': 'SA', // Saudi Arabia
            '+221': 'SN', // Senegal
            '+381': 'RS', // Serbia
            '+248': 'SC', // Seychelles
            '+232': 'SL', // Sierra Leone
            '+65': 'SG', // Singapore
            '+421': 'SK', // Slovakia
            '+386': 'SI', // Slovenia
            '+677': 'SB', // Solomon Islands
            '+252': 'SO', // Somalia
            '+27': 'ZA', // South Africa
            '+82': 'KR', // South Korea
            '+211': 'SS', // South Sudan
            '+34': 'ES', // Spain
            '+94': 'LK', // Sri Lanka
            '+249': 'SD', // Sudan
            '+597': 'SR', // Suriname
            '+268': 'SZ', // Eswatini
            '+46': 'SE', // Sweden
            '+41': 'CH', // Switzerland
            '+963': 'SY', // Syria
            '+886': 'TW', // Taiwan
            '+992': 'TJ', // Tajikistan
            '+255': 'TZ', // Tanzania
            '+66': 'TH', // Thailand
            '+228': 'TG', // Togo
            '+690': 'TK', // Tokelau
            '+676': 'TO', // Tonga
            '+1-868': 'TT', // Trinidad and Tobago
            '+216': 'TN', // Tunisia
            '+90': 'TR', // Turkey
            '+993': 'TM', // Turkmenistan
            '+688': 'TV', // Tuvalu
            '+256': 'UG', // Uganda
            '+380': 'UA', // Ukraine
            '+971': 'AE', // United Arab Emirates
            '+44': 'GB', // United Kingdom
            '+598': 'UY', // Uruguay
            '+998': 'UZ', // Uzbekistan
            '+678': 'VU', // Vanuatu
            '+379': 'VA', // Vatican
            '+58': 'VE', // Venezuela
            '+84': 'VN', // Vietnam
            '+681': 'WF', // Wallis and Futuna
            '+967': 'YE', // Yemen
            '+260': 'ZM', // Zambia
            '+263': 'ZW', // Zimbabwe
        };

        // Handle special cases where multiple countries share the same calling code
        const specialCases = {
            '+1': {
                'US': ['United States'],
                'CA': ['Canada'],
                'DO': ['Dominican Republic'],
                'PR': ['Puerto Rico'],
                'JM': ['Jamaica'],
                'TT': ['Trinidad and Tobago'],
                'BS': ['Bahamas'],
                'BB': ['Barbados'],
                'AG': ['Antigua and Barbuda'],
                'VC': ['Saint Vincent and the Grenadines'],
                'LC': ['Saint Lucia'],
                'DM': ['Dominica'],
                'GD': ['Grenada'],
                'KN': ['Saint Kitts and Nevis'],
                'KY': ['Cayman Islands'],
                'VG': ['British Virgin Islands'],
                'VI': ['U.S. Virgin Islands'],
                'BM': ['Bermuda'],
                'AI': ['Anguilla'],
                'MS': ['Montserrat'],
                'TC': ['Turks and Caicos Islands'],
                'GU': ['Guam'],
                'MP': ['Northern Mariana Islands'],
                'AS': ['American Samoa'],
                'SX': ['Sint Maarten'],
                'UM': ['United States Minor Outlying Islands']
            },
            '+7': {
                'RU': ['Russia'],
                'KZ': ['Kazakhstan']
            }
        };

        // Check if the calling code is a special case
        if (specialCases[callingCode]) {
            // In a real application, you might want additional logic to determine which country
            // For this example, we'll return the first one
            return Object.keys(specialCases[callingCode])[0];
        }

        return countryCallingCodes[callingCode] || null;
    }

    const handleEnquirySubmit = async (e) => {
        e.preventDefault();
        // console.log(countryCode)
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            const response = await axiosInstance.post('/ticket/addNewTicket?enquiryFrom=swift', {
                queryMessage: enquiryForm.queryMessage,
                queryProductName: product?.name || '', // Added null check for product
                senderName: enquiryForm.senderName,
                senderMobile: countryCode + enquiryForm.senderMobile,
                senderCountryIso: getCountryCodeFromCallingCode(countryCode),
                senderEmail: enquiryForm.senderEmail,
                queryMcatName: enquiryForm.queryProductName,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200 && response.data?.status === "success") {
                onClose(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Enquiry Submitted',
                    text: response.data?.message || 'We will get back to you soon!',
                    timer: 1000, // Auto close after 1 seconds
                    showConfirmButton: false, // Hide confirm button
                    willClose: () => {
                        setCountryCode('')
                        setEnquiryForm({
                            queryMessage: '',
                            queryProductName: product?.name || '',
                            senderName: '',
                            senderMobile: '',
                            senderCountryIso: 'IN',
                            senderEmail: ''
                        });
                    }
                });

            } else {
                throw new Error(response.data?.message || 'Unexpected response from server');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: error.response?.data?.message ||
                    error.message ||
                    'There was a problem submitting your enquiry',
                confirmButtonText: 'OK',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-auto">
            <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div>
                    <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="senderName"
                        value={enquiryForm.senderName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.senderName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your full name"
                    />
                    {errors.senderName && <p className="mt-1 text-sm text-red-600">{errors.senderName}</p>}
                </div>

                <div>
                    <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="senderEmail"
                        value={enquiryForm.senderEmail}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.senderEmail ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="your.email@example.com"
                    />
                    {errors.senderEmail && <p className="mt-1 text-sm text-red-600">{errors.senderEmail}</p>}
                </div>

                <div>
                    <label htmlFor="queryProductName" className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="queryProductName"
                        value={enquiryForm.queryProductName}
                        onChange={handleChange}
                        readOnly
                        className={`w-full px-4 py-2 border capitalize rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.queryProductName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.queryProductName && <p className="mt-1 text-sm text-red-600">{errors.queryProductName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <label htmlFor="senderCountryIso" className="block text-sm font-medium text-gray-700 mb-1">
                            Country Code
                        </label>
                        <select
                            id="senderCountryIso"
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                            <option value="+93">Afghanistan (+93)</option>
                            <option value="+355">Albania (+355)</option>
                            <option value="+213">Algeria (+213)</option>
                            <option value="+1">American Samoa (+1)</option>
                            <option value="+376">Andorra (+376)</option>
                            <option value="+244">Angola (+244)</option>
                            <option value="+1">Anguilla (+1)</option>
                            <option value="+1">Antigua and Barbuda (+1)</option>
                            <option value="+54">Argentina (+54)</option>
                            <option value="+374">Armenia (+374)</option>
                            <option value="+297">Aruba (+297)</option>
                            <option value="+61">Australia (+61)</option>
                            <option value="+43">Austria (+43)</option>
                            <option value="+994">Azerbaijan (+994)</option>
                            <option value="+1">Bahamas (+1)</option>
                            <option value="+973">Bahrain (+973)</option>
                            <option value="+880">Bangladesh (+880)</option>
                            <option value="+1">Barbados (+1)</option>
                            <option value="+375">Belarus (+375)</option>
                            <option value="+32">Belgium (+32)</option>
                            <option value="+501">Belize (+501)</option>
                            <option value="+229">Benin (+229)</option>
                            <option value="+1">Bermuda (+1)</option>
                            <option value="+975">Bhutan (+975)</option>
                            <option value="+591">Bolivia (+591)</option>
                            <option value="+387">Bosnia and Herzegovina (+387)</option>
                            <option value="+267">Botswana (+267)</option>
                            <option value="+55">Brazil (+55)</option>
                            <option value="+246">British Indian Ocean Territory (+246)</option>
                            <option value="+1">British Virgin Islands (+1)</option>
                            <option value="+673">Brunei (+673)</option>
                            <option value="+359">Bulgaria (+359)</option>
                            <option value="+226">Burkina Faso (+226)</option>
                            <option value="+257">Burundi (+257)</option>
                            <option value="+855">Cambodia (+855)</option>
                            <option value="+237">Cameroon (+237)</option>
                            <option value="+1">Canada (+1)</option>
                            <option value="+238">Cape Verde (+238)</option>
                            <option value="+1">Cayman Islands (+1)</option>
                            <option value="+236">Central African Republic (+236)</option>
                            <option value="+235">Chad (+235)</option>
                            <option value="+56">Chile (+56)</option>
                            <option value="+86">China (+86)</option>
                            <option value="+61">Christmas Island (+61)</option>
                            <option value="+61">Cocos Islands (+61)</option>
                            <option value="+57">Colombia (+57)</option>
                            <option value="+269">Comoros (+269)</option>
                            <option value="+682">Cook Islands (+682)</option>
                            <option value="+506">Costa Rica (+506)</option>
                            <option value="+385">Croatia (+385)</option>
                            <option value="+53">Cuba (+53)</option>
                            <option value="+599">Curacao (+599)</option>
                            <option value="+357">Cyprus (+357)</option>
                            <option value="+420">Czech Republic (+420)</option>
                            <option value="+243">Democratic Republic of the Congo (+243)</option>
                            <option value="+45">Denmark (+45)</option>
                            <option value="+253">Djibouti (+253)</option>
                            <option value="+1">Dominica (+1)</option>
                            <option value="+1">Dominican Republic (+1)</option>
                            <option value="+670">East Timor (+670)</option>
                            <option value="+593">Ecuador (+593)</option>
                            <option value="+20">Egypt (+20)</option>
                            <option value="+503">El Salvador (+503)</option>
                            <option value="+240">Equatorial Guinea (+240)</option>
                            <option value="+291">Eritrea (+291)</option>
                            <option value="+372">Estonia (+372)</option>
                            <option value="+251">Ethiopia (+251)</option>
                            <option value="+500">Falkland Islands (+500)</option>
                            <option value="+298">Faroe Islands (+298)</option>
                            <option value="+679">Fiji (+679)</option>
                            <option value="+358">Finland (+358)</option>
                            <option value="+33">France (+33)</option>
                            <option value="+689">French Polynesia (+689)</option>
                            <option value="+241">Gabon (+241)</option>
                            <option value="+220">Gambia (+220)</option>
                            <option value="+995">Georgia (+995)</option>
                            <option value="+49">Germany (+49)</option>
                            <option value="+233">Ghana (+233)</option>
                            <option value="+350">Gibraltar (+350)</option>
                            <option value="+30">Greece (+30)</option>
                            <option value="+299">Greenland (+299)</option>
                            <option value="+1">Grenada (+1)</option>
                            <option value="+1">Guam (+1)</option>
                            <option value="+502">Guatemala (+502)</option>
                            <option value="+44">Guernsey (+44)</option>
                            <option value="+224">Guinea (+224)</option>
                            <option value="+245">Guinea-Bissau (+245)</option>
                            <option value="+592">Guyana (+592)</option>
                            <option value="+509">Haiti (+509)</option>
                            <option value="+504">Honduras (+504)</option>
                            <option value="+852">Hong Kong (+852)</option>
                            <option value="+36">Hungary (+36)</option>
                            <option value="+354">Iceland (+354)</option>
                            <option value="+91">India (+91)</option>
                            <option value="+62">Indonesia (+62)</option>
                            <option value="+98">Iran (+98)</option>
                            <option value="+964">Iraq (+964)</option>
                            <option value="+353">Ireland (+353)</option>
                            <option value="+44">Isle of Man (+44)</option>
                            <option value="+972">Israel (+972)</option>
                            <option value="+39">Italy (+39)</option>
                            <option value="+225">Ivory Coast (+225)</option>
                            <option value="+1">Jamaica (+1)</option>
                            <option value="+81">Japan (+81)</option>
                            <option value="+44">Jersey (+44)</option>
                            <option value="+962">Jordan (+962)</option>
                            <option value="+7">Kazakhstan (+7)</option>
                            <option value="+254">Kenya (+254)</option>
                            <option value="+686">Kiribati (+686)</option>
                            <option value="+383">Kosovo (+383)</option>
                            <option value="+965">Kuwait (+965)</option>
                            <option value="+996">Kyrgyzstan (+996)</option>
                            <option value="+856">Laos (+856)</option>
                            <option value="+371">Latvia (+371)</option>
                            <option value="+961">Lebanon (+961)</option>
                            <option value="+266">Lesotho (+266)</option>
                            <option value="+231">Liberia (+231)</option>
                            <option value="+218">Libya (+218)</option>
                            <option value="+423">Liechtenstein (+423)</option>
                            <option value="+370">Lithuania (+370)</option>
                            <option value="+352">Luxembourg (+352)</option>
                            <option value="+853">Macau (+853)</option>
                            <option value="+389">Macedonia (+389)</option>
                            <option value="+261">Madagascar (+261)</option>
                            <option value="+265">Malawi (+265)</option>
                            <option value="+60">Malaysia (+60)</option>
                            <option value="+960">Maldives (+960)</option>
                            <option value="+223">Mali (+223)</option>
                            <option value="+356">Malta (+356)</option>
                            <option value="+692">Marshall Islands (+692)</option>
                            <option value="+222">Mauritania (+222)</option>
                            <option value="+230">Mauritius (+230)</option>
                            <option value="+262">Mayotte (+262)</option>
                            <option value="+52">Mexico (+52)</option>
                            <option value="+691">Micronesia (+691)</option>
                            <option value="+373">Moldova (+373)</option>
                            <option value="+377">Monaco (+377)</option>
                            <option value="+976">Mongolia (+976)</option>
                            <option value="+382">Montenegro (+382)</option>
                            <option value="+1">Montserrat (+1)</option>
                            <option value="+212">Morocco (+212)</option>
                            <option value="+258">Mozambique (+258)</option>
                            <option value="+95">Myanmar (+95)</option>
                            <option value="+264">Namibia (+264)</option>
                            <option value="+674">Nauru (+674)</option>
                            <option value="+977">Nepal (+977)</option>
                            <option value="+31">Netherlands (+31)</option>
                            <option value="+599">Netherlands Antilles (+599)</option>
                            <option value="+687">New Caledonia (+687)</option>
                            <option value="+64">New Zealand (+64)</option>
                            <option value="+505">Nicaragua (+505)</option>
                            <option value="+227">Niger (+227)</option>
                            <option value="+234">Nigeria (+234)</option>
                            <option value="+683">Niue (+683)</option>
                            <option value="+850">North Korea (+850)</option>
                            <option value="+1">Northern Mariana Islands (+1)</option>
                            <option value="+47">Norway (+47)</option>
                            <option value="+968">Oman (+968)</option>
                            <option value="+92">Pakistan (+92)</option>
                            <option value="+680">Palau (+680)</option>
                            <option value="+970">Palestine (+970)</option>
                            <option value="+507">Panama (+507)</option>
                            <option value="+675">Papua New Guinea (+675)</option>
                            <option value="+595">Paraguay (+595)</option>
                            <option value="+51">Peru (+51)</option>
                            <option value="+63">Philippines (+63)</option>
                            <option value="+64">Pitcairn (+64)</option>
                            <option value="+48">Poland (+48)</option>
                            <option value="+351">Portugal (+351)</option>
                            <option value="+1">Puerto Rico (+1)</option>
                            <option value="+974">Qatar (+974)</option>
                            <option value="+242">Republic of the Congo (+242)</option>
                            <option value="+262">Reunion (+262)</option>
                            <option value="+40">Romania (+40)</option>
                            <option value="+7">Russia (+7)</option>
                            <option value="+250">Rwanda (+250)</option>
                            <option value="+590">Saint Barthelemy (+590)</option>
                            <option value="+290">Saint Helena (+290)</option>
                            <option value="+1">Saint Kitts and Nevis (+1)</option>
                            <option value="+1">Saint Lucia (+1)</option>
                            <option value="+590">Saint Martin (+590)</option>
                            <option value="+508">Saint Pierre and Miquelon (+508)</option>
                            <option value="+1">Saint Vincent and the Grenadines (+1)</option>
                            <option value="+685">Samoa (+685)</option>
                            <option value="+378">San Marino (+378)</option>
                            <option value="+239">Sao Tome and Principe (+239)</option>
                            <option value="+966">Saudi Arabia (+966)</option>
                            <option value="+221">Senegal (+221)</option>
                            <option value="+381">Serbia (+381)</option>
                            <option value="+248">Seychelles (+248)</option>
                            <option value="+232">Sierra Leone (+232)</option>
                            <option value="+65">Singapore (+65)</option>
                            <option value="+1">Sint Maarten (+1)</option>
                            <option value="+421">Slovakia (+421)</option>
                            <option value="+386">Slovenia (+386)</option>
                            <option value="+677">Solomon Islands (+677)</option>
                            <option value="+252">Somalia (+252)</option>
                            <option value="+27">South Africa (+27)</option>
                            <option value="+82">South Korea (+82)</option>
                            <option value="+211">South Sudan (+211)</option>
                            <option value="+34">Spain (+34)</option>
                            <option value="+94">Sri Lanka (+94)</option>
                            <option value="+249">Sudan (+249)</option>
                            <option value="+597">Suriname (+597)</option>
                            <option value="+47">Svalbard and Jan Mayen (+47)</option>
                            <option value="+268">Swaziland (+268)</option>
                            <option value="+46">Sweden (+46)</option>
                            <option value="+41">Switzerland (+41)</option>
                            <option value="+963">Syria (+963)</option>
                            <option value="+886">Taiwan (+886)</option>
                            <option value="+992">Tajikistan (+992)</option>
                            <option value="+255">Tanzania (+255)</option>
                            <option value="+66">Thailand (+66)</option>
                            <option value="+228">Togo (+228)</option>
                            <option value="+690">Tokelau (+690)</option>
                            <option value="+676">Tonga (+676)</option>
                            <option value="+1">Trinidad and Tobago (+1)</option>
                            <option value="+216">Tunisia (+216)</option>
                            <option value="+90">Turkey (+90)</option>
                            <option value="+993">Turkmenistan (+993)</option>
                            <option value="+1">Turks and Caicos Islands (+1)</option>
                            <option value="+688">Tuvalu (+688)</option>
                            <option value="+1">U.S. Virgin Islands (+1)</option>
                            <option value="+256">Uganda (+256)</option>
                            <option value="+380">Ukraine (+380)</option>
                            <option value="+971">United Arab Emirates (+971)</option>
                            <option value="+44">United Kingdom (+44)</option>
                            <option value="+1">United States (+1)</option>
                            <option value="+598">Uruguay (+598)</option>
                            <option value="+998">Uzbekistan (+998)</option>
                            <option value="+678">Vanuatu (+678)</option>
                            <option value="+379">Vatican (+379)</option>
                            <option value="+58">Venezuela (+58)</option>
                            <option value="+84">Vietnam (+84)</option>
                            <option value="+681">Wallis and Futuna (+681)</option>
                            <option value="+212">Western Sahara (+212)</option>
                            <option value="+967">Yemen (+967)</option>
                            <option value="+260">Zambia (+260)</option>
                            <option value="+263">Zimbabwe (+263)</option>
                        </select>
                    </div>
                    <div className="col-span-1">
                        <label htmlFor="senderMobile" className="block text-sm font-medium text-gray-700 mb-1">
                            Mobile <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            id="senderMobile"
                            value={enquiryForm.senderMobile}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.senderMobile ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="9876543210"
                        />
                        {errors.senderMobile && <p className="mt-1 text-sm text-red-600">{errors.senderMobile}</p>}
                    </div>
                </div>

                <div>
                    <label htmlFor="queryMessage" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Enquiry <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="queryMessage"
                        value={enquiryForm.queryMessage}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.queryMessage ? 'border-red-500' : 'border-gray-300'}`}
                        rows="4"
                        placeholder="Please provide details about your enquiry..."
                    ></textarea>
                    {errors.queryMessage && <p className="mt-1 text-sm text-red-600">{errors.queryMessage}</p>}
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                    <button
                        type="button"
                        onClick={() => onClose(false)}
                        className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            'Submit Enquiry'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EnquireForm;