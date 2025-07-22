import { useState, useRef } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaWhatsappSquare } from "react-icons/fa";
import { FiPhone, FiLock, FiChevronDown } from "react-icons/fi";
import axiosInstance from './AxiosInstance';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Nlogo.png';
import { useAuth } from './AuthContext';

function Login({ onClose }) {
  const { token, setToken, user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const phoneInputRef = useRef(null);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const [registerForm, setRegisterForm] = useState(false);


  const countryCodes = [
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+1', name: 'USA', flag: '🇺🇸' },
    { code: '+44', name: 'UK', flag: '🇬🇧' },
    { code: '+971', name: 'UAE', flag: '🇦🇪' },
  ];

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhone(value);
    if (value.length >= 8) {
      setErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/g, '');
    if (!value && value !== '') return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (index < 5 && value) {
      inputsRef.current[index + 1].focus();
    }
    if (newOtp.join('').length === 6) {
      setErrors((prev) => ({ ...prev, otp: '' }));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputsRef.current[index - 1].focus();
    }
  };

  const sendOtp = async () => {
    console.log(phone.length)
    if (phone.length < 10) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Phone Number',
        text: 'Phone number must be at least 10 digits.',
        confirmButtonColor: '#3085d6',
      });
      return; // prevent further execution
    }
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(`/swiftlymeds/auth/login`, {
        swiftUserPhone: countryCode + phone,
      });

      const { message, token } = response.data;

      if (message === "OTP sent") {
        setOtpSent(true);
        setShowOtpField(true);
        setRegisterForm(false);

        Swal.fire({
          icon: 'success',
          title: 'OTP Sent',
          text: `A 6-digit OTP has been sent to ${countryCode}${phone}`,
          confirmButtonText: 'OK',
        });

        if (token) {
          localStorage.setItem('jwtToken', token);
          setToken(token);
        }
        setIsLoading(false);

      } else if (message === "User not found") {
        setShowOtpField(false);
        setRegisterForm(true);
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to send OTP. Please try again.',
        confirmButtonText: 'OK',
      });
      setIsLoading(false)
    } finally {
      setIsLoading(false);
    }
  };


  const handleResendOtp = async () => {
    await sendOtp();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!showOtpField) {
      await sendOtp();
    } else {
      await handleSignUp();
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(false)
    const otpCode = otp.join('');

    if (otpCode.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid OTP',
        text: 'OTP must be 6 digits long',
      });
      return; // Exit early
    }
    try {
      setIsLoading(true)
      const fullPhone = countryCode + phone;
      const otpCode = otp.join('');
      const response = await axiosInstance.post('/swiftlymeds/auth/verify-otp', {
        swiftUserPhone: fullPhone,
        otp: otpCode,
      });
      localStorage.setItem("jwtToken", response.data.token)
      setToken(response.data.token)
      console.log('user', response.data.user)
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      Swal.fire({
        icon: 'success',
        title: `${response.data.message} and Login Successfully`,
        html: `
          <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    ">
      <img src="${Logo}" 
          alt="SwiftlyMeds Logo" 
          style="
            width: 200px;
            height: 80px;
            margin-bottom: 15px;
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.5s ease-out;
          "
          class="swal-welcome-image"
          onerror="this.style.display='none'; console.error('Image failed to load')">
    </div>
        `,
        timer: 4000,
        showConfirmButton: false,
        didOpen: () => {
          // Trigger animations after the modal is opened
          setTimeout(() => {
            const image = document.querySelector('.swal2-popup .swal-welcome-image');
            const message = document.querySelector('.swal2-popup .swal-welcome-message');

            if (image) {
              image.style.opacity = '1';
              image.style.transform = 'scale(1)';
            }

            if (message) {
              message.style.opacity = '1';
              message.style.transform = 'translateY(0)';
            }
          }, 100);
        },
        willClose: () => {
          // Optional closing animations
          const image = document.querySelector('.swal2-popup .swal-welcome-image');
          const message = document.querySelector('.swal2-popup .swal-welcome-message');

          if (image) {
            image.style.opacity = '0';
            image.style.transform = 'scale(0.8)';
          }

          if (message) {
            message.style.opacity = '0';
            message.style.transform = 'translateY(-20px)';
          }
        },
        background: '#ffffff',
        backdrop: `
    rgba(0,0,0,0.4)
    url("/images/nyan-cat.gif")
    left top
    no-repeat
  `
      });
      setIsLoading(false)
    
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: error.response?.data?.message || 'Invalid OTP',
      });
      setIsLoading(false)
    }
  };

  const handleRegister = async () => {
    setIsLoading(false)
    try {
      setIsLoading(true)
      const response = await axiosInstance.post('/swiftlymeds/auth/signup', {
        swiftUserName: name,
        swiftUserEmail: email,
        swiftUserPhone: countryCode + phone,
        swiftUserPassword: password
      });
      Swal.fire({
        icon: 'success',
        title: response.data.message,
        text: 'Please login with your phone number.',
      });

      setRegisterForm(false);
      setShowOtpField(true);
      setOtpSent(false);
      setOtp(Array(6).fill(''));
      setIsLoading(false)
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.message || 'Something went wrong',
      });
      setIsLoading(false)
    }
  };

  return (
    <div className="flex flex-col justify-center py-8 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-100 sm:px-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {registerForm ? 'Register' : showOtpField ? 'Enter OTP' : 'Sign In / Sign Up'}
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {showOtpField && !registerForm
              ? `We've sent a 6-digit OTP to ${countryCode}${phone}`
              : 'Sign up or Sign in to access your orders, special offers, health tips and more!'}
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!showOtpField && !registerForm && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="mt-1 flex gap-2 rounded-md shadow-sm">
                  <div className="relative">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-full py-2 pl-3 rounded-md font-bold border border-gray-300 bg-[#BBFBFF] text-sm appearance-none"
                      aria-label="Select country code"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
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
                      className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      minLength="8"
                      maxLength="10"
                    />
                  </div>
                </div>
              </div>
            )}

            {showOtpField && !registerForm && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <div className="flex justify-center space-x-2 mt-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputsRef.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="1"
                      className="w-10 h-10 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={digit}
                      onChange={(e) => handleChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Didn't receive OTP?{' '}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                    disabled={isLoading}
                  >
                    Resend
                  </button>
                </p>
                <button
                  disabled={isLoading}
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  {isLoading ? "Please Wait.." : "Verify OTP"}
                </button>
              </div>
            )}

            {registerForm && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                    minLength="8"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                </div>

                <button
                  disabled={isLoading}
                  type="button"
                  onClick={handleRegister}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  {isLoading ? "Please Wait..." : "Register"}
                </button>
              </div>
            )}

            {!showOtpField && !registerForm && (
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold bg-[#BBFBFF] hover:bg-[#4ED7F1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${isLoading || phone.length < 8 ? 'opacity-80 cursor-not-allowed' : ''
                  }`}
              >
                {isLoading ? "Please Wait " : "Continue"}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
