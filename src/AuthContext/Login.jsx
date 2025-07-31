import { useState, useRef, useEffect } from 'react';
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
  const [email, setEmail] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [password, setPassword] = useState("");
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const [registerForm, setRegisterForm] = useState(false);
  const [generateCaptcha, setGenerateCaptcha] = useState("");
  const [matchCaptcha, setMatchCaptcha] = useState("");
  const [matched, setMatched] = useState(false);

  const countryCodes = [
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+1', name: 'USA', flag: '🇺🇸' },
    { code: '+44', name: 'UK', flag: '🇬🇧' },
    { code: '+971', name: 'UAE', flag: '🇦🇪' },
  ];

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhone(value);
    if (value.length >= 8) {
      setErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

  const generateCaptchaFunction = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setGenerateCaptcha(captcha);
    setMatchCaptcha("");
    setMatched(false);
  };

  useEffect(() => {
    generateCaptchaFunction();
  }, []);

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
    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(`/swiftlymeds/auth/login`, {
        swiftUserEmail: email,
      });

      const { message, token } = response.data;

      if (message === "OTP sent") {
        setOtpSent(true);
        setShowOtpField(true);
        setRegisterForm(false);
        setErrors({});

        Swal.fire({
          icon: 'success',
          title: 'OTP Sent',
          text: `A 6-digit OTP has been sent to ${email}`,
          confirmButtonText: 'OK',
        });

        if (token) {
          localStorage.setItem('jwtToken', token);
          setToken(token);
        }
      } else if (message === "User not found") {
        setShowOtpField(false);
        setRegisterForm(true);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to send OTP. Please try again.',
      });
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
    }
  };

  const handleVerifyOtp = async () => {
    if (generateCaptcha !== matchCaptcha) {
      Swal.fire({
        icon: 'warning',
        title: 'CAPTCHA not matched',
      });
      return;
    }

    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid OTP',
        text: 'OTP must be 6 digits long',
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/swiftlymeds/auth/verify-otp', {
        swiftUserEmail: email,
        otp: otpCode,
      });

      localStorage.setItem("jwtToken", response.data.token);
      setToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);

      Swal.fire({
        icon: 'success',
        title: `${response.data.message}`,
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
          setTimeout(() => {
            const image = document.querySelector('.swal2-popup .swal-welcome-image');
            if (image) {
              image.style.opacity = '1';
              image.style.transform = 'scale(1)';
            }
          }, 100);
        },
        willClose: () => {
          const image = document.querySelector('.swal2-popup .swal-welcome-image');
          if (image) {
            image.style.opacity = '0';
            image.style.transform = 'scale(0.8)';
          }
        },
        background: '#ffffff',
        backdrop: `
          rgba(0,0,0,0.4)
          url("/images/nyan-cat.gif")
          left top
          no-repeat
        `,
      });

      setEmail("");
      setOtp(Array(6).fill(''));
      setShowOtpField(false);
      setOtpSent(false);
      if (onClose) onClose(); // Close modal if provided
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: error.response?.data?.message || 'Invalid OTP. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {

    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/swiftlymeds/auth/signup', {
        swiftUserName: name,
        swiftUserEmail: email,
        swiftUserPhone: countryCode + phone,
        swiftUserPassword: password,
      });

      Swal.fire({
        icon: 'success',
        title: response.data.message,
        text: 'Please verify your email with the OTP sent.',
      });

      setRegisterForm(false);
      setShowOtpField(true);
      setOtpSent(true);
      setOtp(Array(6).fill(''));
      setName("");
      setPhone("");
      setPassword("");
      setErrors({});
      await sendOtp(); // Automatically send OTP after signup
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
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
              ? `We've sent a 6-digit OTP to ${email}`
              : 'Sign up or Sign in to access your orders, special offers, health tips and more!'}
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!showOtpField && !registerForm && (
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
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                <div className="flex flex-col p-4 border border-gray-300 rounded-lg bg-gray-50 max-w-md">
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="captcha-input" className="text-sm font-medium text-gray-700">
                      Enter CAPTCHA:
                    </label>
                    <div className={`text-sm font-medium ${matchCaptcha && (matchCaptcha === generateCaptcha ? 'text-green-600' : 'text-red-600')}`}>
                      {matchCaptcha && (matchCaptcha === generateCaptcha ? '✓ Match' : '✗ No match')}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-white p-2 rounded border border-gray-200 text-center font-mono text-lg tracking-widest select-none">
                      {generateCaptcha}
                    </div>
                    <button
                      className="p-2 text-gray-500 hover:text-gray-700"
                      onClick={generateCaptchaFunction}
                      aria-label="Refresh CAPTCHA"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                    <input
                      id="captcha-input"
                      type="text"
                      value={matchCaptcha}
                      onChange={(e) => {
                        const input = e.target.value;
                        if (/^[a-zA-Z0-9]{0,6}$/.test(input)) {
                          setMatchCaptcha(input);
                          setMatched(input === generateCaptcha);
                        }
                      }}
                      maxLength={6}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Type here"
                    />
                  </div>
                </div>
                <button
                  disabled={isLoading || !matched || otp.join('').length < 6}
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                >
                  {isLoading ? "Please Wait..." : "Verify OTP"}
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
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
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
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <button
                  disabled={isLoading}
                  type="button"
                  onClick={handleRegister}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                >
                  {isLoading ? "Please Wait..." : "Register"}
                </button>
              </div>
            )}

            {!showOtpField && !registerForm && (
              <button
                type="submit"
                disabled={isLoading || !email}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold bg-[#BBFBFF] hover:bg-[#4ED7F1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${isLoading || !email ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {isLoading ? "Please Wait..." : "Continue"}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;