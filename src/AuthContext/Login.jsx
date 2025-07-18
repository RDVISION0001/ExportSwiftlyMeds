import { useState, useRef } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaWhatsappSquare } from "react-icons/fa";
import { FiPhone, FiLock, FiChevronDown } from "react-icons/fi";
import axios from 'axios';

function Login({ onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const phoneInputRef = useRef(null);

  const countryCodes = [
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+1', name: 'USA', flag: '🇺🇸' },
    { code: '+44', name: 'UK', flag: '🇬🇧' },
    { code: '+971', name: 'UAE', flag: '🇦🇪' },
  ];

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    setPhone(value);
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Password must be at least 8 characters long");
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors;
    }
    
    if (!otp || otp.length !== 6) newErrors.otp = "Please enter a valid 6-digit OTP";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOtp = async () => {
    try {
      setIsLoading(true);
      // Replace with your actual OTP sending API endpoint
      const response = await axios.post(`http://192.168.1.18:8083/swiftlymeds/auth/verify-otp`, {
        swiftUserPhone: countryCode + phone
      });
      setOtpSent(true);
      setShowOtpField(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const signUpData = {
        swiftUserName: name,
        swiftUserEmail: email,
        swiftUserPhone: countryCode + phone,
        swiftUserPassword: password,
        otp: otp,
      };

      const response = await axios.post(`http://192.168.1.18:8083/swiftlymeds/auth/signup`, signUpData);
      
      if (response.data.success) {
        alert("Registration successful!");
        onClose(false);
      } else {
        alert(response.data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.response?.data?.message || "An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!showOtpField) {
      if (phone.length < 8) {
        phoneInputRef.current.focus();
        return;
      }
      await sendOtp();
    } else {
      await handleSignUp();
    }
  };

  return (
    <div className="flex flex-col justify-center py-8 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-100 sm:px-10">
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>
            {showOtpField ? 'Complete Registration' : 'Sign In / Sign Up'}
          </h2>
          <p className='text-sm text-gray-600 mb-6'>
            {showOtpField 
              ? `We've sent a 6-digit OTP to ${countryCode}${phone}`
              : 'Sign up or Sign in to access your orders, special offers, health tips and more!'}
          </p>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            {!showOtpField ? (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="mt-1 flex gap-2 rounded-md shadow-sm ">
                  <div className="relative">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-full py-2 pl-3 rounded-md font-bold border border-gray-300 bg-[#BBFBFF] text-sm appearance-none"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative flex-1 flex items-center">
                    <div className="absolute left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      ref={phoneInputRef}
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="Enter phone number"
                      className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300"
                      required
                      minLength="8"
                      maxLength="12"
                    />
                  </div>
                </div>
                {phone.length > 0 && phone.length < 8 && (
                  <p className="mt-1 text-xs text-red-500">Please enter a valid phone number</p>
                )}
              </div>
            ) : (
              <div className='space-y-2'>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm border border-gray-300">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Name"
                    className="block w-full pl-3 py-2 border-0 bg-transparent focus:ring-0 sm:text-sm"
                    required
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}

                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm border border-gray-300">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                    className="block w-full pl-3 py-2 border-0 bg-transparent focus:ring-0 sm:text-sm"
                    required
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}

                <label htmlFor="pass" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm border border-gray-300">
                  <input
                    id="pass"
                    name="pass"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Strong Password"
                    className="block w-full pl-3 py-2 border-0 bg-transparent focus:ring-0 sm:text-sm"
                    required
                  />
                </div>
                {errors.password && (
                  <div className="text-xs text-red-500">
                    {errors.password.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}

                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <div className="mt-1 relative rounded-md shadow-sm border border-gray-300">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="6-digit OTP"
                    className="block w-full pl-10 pr-3 py-2 border-0 bg-transparent focus:ring-0 sm:text-sm"
                    required
                  />
                </div>
                {errors.otp && <p className="text-xs text-red-500">{errors.otp}</p>}
                {otpSent && (
                  <p className="mt-2 text-xs text-gray-500">
                    Didn't receive OTP? <button type="button" className="text-indigo-600 hover:text-indigo-500 font-medium">Resend</button>
                  </p>
                )}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading || (!showOtpField && phone.length < 8)}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold bg-[#BBFBFF] hover:[#4ED7F1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                  isLoading || (!showOtpField && phone.length < 8) ? 'opacity-80 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {showOtpField ? 'Registering...' : 'Sending OTP...'}
                  </>
                ) : (
                  showOtpField ? 'Register' : 'Continue'
                )}
              </button>
            </div>
          </form>

          {!showOtpField && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FcGoogle className="h-5 w-5" />
                    <span className="ml-2">Google</span>
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FaWhatsappSquare className="h-5 w-5 text-green-500" />
                    <span className="ml-2">WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;