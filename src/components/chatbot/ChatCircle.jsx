import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { FaComment, FaTimes, FaPaperPlane, FaUser, FaPhone, FaPrescriptionBottleAlt, FaBoxOpen, FaQuestionCircle, FaExpand, FaCompress, FaSearchPlus, FaSearchMinus } from "react-icons/fa";
import { Link } from "react-router-dom";
import axiosInstance from "../../AuthContext/AxiosInstance";

const ChatCircle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [position, setPosition] = useState({
    x: window.innerWidth - 80,
    y: window.innerHeight - 80,
  });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", mobile: "", email: "" });
  const [formErrors, setFormErrors] = useState({});
  const [selectedReply, setSelectedReply] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef(null);
  const nameInputRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const chatContainerRef = useRef(null);
  const [sndingOtp,setResendingOtp] = useState(false)

  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: clamp(prev.x, 60, window.innerWidth - 60),
        y: clamp(prev.y, 60, window.innerHeight - 60),
      }));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startDrag = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    dragStart.current = { x: clientX, y: clientY };

    const onMove = (moveEvent) => {
      const moveX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
      const moveY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY);
      const dx = moveX - dragStart.current.x;
      const dy = moveY - dragStart.current.y;
      dragStart.current = { x: moveX, y: moveY };

      setPosition((prev) => ({
        x: clamp(prev.x + dx, 60, window.innerWidth - 60),
        y: clamp(prev.y + dy, 60, window.innerHeight - 60),
      }));
    };

    const onEnd = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchend", onEnd);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchend", onEnd);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "Thank you for your message. Our agent will respond shortly.", sender: "bot" }]);
    }, 800);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!/^\+?\d{10,15}$/.test(formData.mobile)) errors.mobile = "Invalid phone number";
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) errors.email = "Invalid email address";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuickReply = (reply) => {
    setSelectedReply(reply);
    setShowForm(true);
    setMessages((prev) => [...prev, { text: reply, sender: "user" }]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setMessages((prev) => [
        ...prev,
        { text: `We've sent a verification code to ${formData.email}. Please enter it below.`, sender: "bot" },
      ]);
      try {
        setLoading(true);
        const response = await axiosInstance.post(`/auth/otp/send`, {
          email: formData.email,
          phone: formData.mobile,
          name: formData.name
        });
        console.log(response);
        setShowForm(false);
        setShowOtpInput(true);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setMessages((prev) => [
          ...prev,
          { text: "Failed to send OTP. Please try again.", sender: "bot" },
        ]);
        setLoading(false);
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      setResendingOtp(true);
      const response = await axiosInstance.post(`/auth/otp/send`, {
        email: formData.email,
        phone: formData.mobile,
        name: formData.name
      });
      console.log(response);
      setMessages((prev) => [
        ...prev,
        { text: `We've resent the verification code to ${formData.email}.`, sender: "bot" },
      ]);
      setResendingOtp(false);
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        { text: `Failed to resend OTP. Please try again later.`, sender: "bot" },
      ]);
      setResendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setLoading(true);

    try {
      const response = await axiosInstance.post(`/auth/otp/verify`, {
        email: formData.email,
        otp: otp
      });

      setMessages((prev) => [
        ...prev,
        { text: otp, sender: "user" },
        { text: `Verification successful!`, sender: "bot" },
        // { text: `👩‍⚕️ Hello ${formData.name}, how can I assist you today?`, sender: "agent" },
      ]);
      setFormData({
        email: '',
        mobile: '',
        name: ''
      });
      setOtp("");
      setShowOtpInput(false);
    } catch (error) {
      console.error("Verification error:", error);
      const errorMessage = error.response?.data || "Verification failed. Please try again.";

      setMessages((prev) => [
        ...prev,
        { text: otp, sender: "user" },
        { text: `❌ ${errorMessage}`, sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChat = (e) => {
    if (isDragging) return;
    if (!isOpen && messages.length === 0) {
      setMessages([
        {
          text: "Welcome to PharmaCare Support. How can we assist you today?",
          sender: "bot",
        },
        {
          text: "Please select an option below or type your question:",
          sender: "bot",
        },
      ]);
    }
    setIsOpen(!isOpen);
    if (!isOpen) setUnreadCount(0);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setIsZoomed(false);
    }
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const quickReplies = [
    { text: "Product Inquiry", icon: <FaPrescriptionBottleAlt className="mr-2" /> },
    { text: "Order Status", icon: <FaBoxOpen className="mr-2" /> },
    { text: "Prescription Help", icon: <FaPrescriptionBottleAlt className="mr-2" /> },
    { text: "Speak to Agent", icon: <FaUser className="mr-2" /> },
    { text: "Request Callback", icon: <FaPhone className="mr-2" /> },
    { text: "General Questions", icon: <FaQuestionCircle className="mr-2" /> },
  ];

  const getSizeStyles = () => {
    if (isFullscreen) {
      return {
        width: '100vw',
        height: '100vh',
        right: 0,
        bottom: 0,
      };
    }

    return {
      width: isZoomed ? '24rem' : '20rem',
      height: isZoomed ? '38rem' : '32rem',
      right: window.innerWidth - position.x,
      bottom: window.innerHeight - position.y,
    };
  };

  return (
    <>
      {isOpen && (
        <div
          ref={chatContainerRef}
          className={`fixed z-[1000] font-sans origin-bottom-right animate-fade-in border border-gray-300 rounded-xl ${isFullscreen ? 'inset-0' : ''}`}
          style={getSizeStyles()}
        >
          <div className={`flex flex-col h-full bg-white rounded-xl shadow-xl overflow-hidden ${isFullscreen ? 'rounded-none' : ''}`}>
            <div
              className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-[#3d8287] to-[#12b9c5] text-white cursor-move select-none"
              onMouseDown={startDrag}
              onTouchStart={startDrag}
            >
              <div className="flex items-center font-semibold">
                <FaComment className="mr-2 text-lg" />
                <span>SwiftlyMeds Support</span>
              </div>
              <div className="flex items-center space-x-2">
                {!isFullscreen && (
                  <button
                    className="text-white opacity-70 hover:opacity-100 transition-opacity p-1 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); toggleZoom(); }}
                    aria-label={isZoomed ? "Zoom out" : "Zoom in"}
                  >
                    {isZoomed ? <FaSearchMinus /> : <FaSearchPlus />}
                  </button>
                )}
                <button
                  className="text-white opacity-70 hover:opacity-100 transition-opacity p-1 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
                <button
                  className="text-white opacity-70 hover:opacity-100 transition-opacity p-1 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                  aria-label="Close chat"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div
              className="flex-1 p-4 overflow-y-auto bg-green-50 scroll-smooth"
              ref={chatBodyRef}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-3 max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-snug relative animate-message-in ${msg.sender === 'user'
                    ? 'ml-auto bg-gradient-to-r from-[#3d8287] to-[#09939d] text-white cursor-move select-none" onMouseDown={startDrag}] to-[#12b9c5] text-white rounded-br-sm'
                    : 'mr-auto bg-white text-gray-800 rounded-bl-sm shadow-sm'
                    }`}
                >
                  <div>{msg.text}</div>
                  <div className="text-xs opacity-70 text-right mt-1">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}

              {showForm && (
                <form
                  className="bg-white p-4 rounded-xl shadow-sm mt-3"
                  onSubmit={handleFormSubmit}
                >
                  <h4 className="text-sm font-medium text-gray-800 mb-4">Please provide your details:</h4>
                  {["name", "mobile", "email"].map((field) => (
                    <div className="mb-3" key={field}>
                      <label className="block text-xs text-gray-600 mb-1 font-medium">
                        {field === "name" ? "" : field === "mobile" ? "" : ""}
                        {formErrors[field] && <span className="text-red-500 font-normal"> • {formErrors[field]}</span>}
                      </label>
                      <input
                        type={field === "email" ? "email" : field === "mobile" ? "tel" : "text"}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#12b9c5] focus:border-[#12b9c5] ${formErrors[field] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder={
                          field === "mobile" ? "+1 (123) 456-7890" :
                            field === "email" ? "your@email.com" : "John Smith"
                        }
                        id={field}
                        name={field}
                        value={formData[field]}
                        onChange={handleFormChange}
                        ref={field === "name" ? nameInputRef : null}
                      />
                    </div>
                  ))}
                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="py-1 px-4 bg-[#12b9c5] text-white text-sm rounded-lg font-medium hover:bg-[#4b8f94] transition-colors cursor-pointer"
                    >
                      {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Submit'}
                    </button>
                    <button
                      type="button"
                      className="py-1 px-4 bg-white cursor-pointer text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {showOtpInput && (
                <form
                  className="bg-white p-4 rounded-xl shadow-sm mt-3"
                  onSubmit={handleVerifyOtp}
                >
                  <div className="mb-3">
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#12b9c5] focus:border-[#42d5e0]"
                      placeholder="Enter 6-digit code"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <div className="text-xs text-gray-500 mt-1">Check your email for the verification code</div>
                    <button 
                      type="button" 
                      className="text-xs hover:cursor-pointer px-4 py-0.5 rounded-xl bg-green-200 text-green-800 mt-1"
                      onClick={handleResendOTP}
                      disabled={loading}
                    >
                      {sndingOtp ? 'Sending...' : 'Resend OTP'}
                    </button>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="px-4 py-1 text-xs bg-[#12b9c5] text-white rounded-lg font-medium hover:bg-[#376a6e] transition-colors cursor-pointer"
                    >
                      {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Verify'}
                    </button>
                    <button
                      type="button"
                      className="px-4 py-1 text-xs bg-white text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setShowOtpInput(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {!showForm && !showOtpInput && messages.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-xs text-gray-500 mb-2 font-medium">Quick options:</h4>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickReply(reply.text)}
                        className="flex items-center px-3 py-2 bg-white text-gray-700 border border-gray-200 rounded-full text-xs font-medium hover:bg-blue-50 hover:text-green-600 hover:border-blue-200 transition-colors"
                      >
                        {reply.icon}
                        <span>{reply.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-white border-t border-gray-200">
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#12b9c5] focus:border-[#12b9c5]"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  aria-label="Type your message"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-[#12b9c5] cursor-pointer text-white flex items-center justify-center hover:bg-[#458387] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={!input.trim()}
                >
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div
        className={`fixed w-14 h-14 rounded-full bg-[#12b9c5] flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all ${isOpen ? "hidden" : ""
          } ${isDragging ? "scale-110" : "scale-100"}`}
        style={{
          left: position.x,
          top: position.y,
          transform: isDragging ? 'scale(1.1)' : 'scale(1)',
        }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        onClick={handleToggleChat}
      >
        <div className="relative">
          <FaComment className="text-white text-xl" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatCircle;