import { useState, useEffect, useRef } from "react";
import "./ChatCircle.css";

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
  const [formErrors, setFormErrors] = useState({ name: "", mobile: "", email: "" });
  const [selectedReply, setSelectedReply] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");

  const chatBodyRef = useRef(null);
  const nameInputRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });

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
        y: clamp(prev.y, 120, window.innerHeight - 60),
      }));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startDrag = (e) => {
    e.preventDefault();
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
        y: clamp(prev.y + dy, 120, window.innerHeight - 60),
      }));
    };

    const onEnd = () => {
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
      setMessages((prev) => [...prev, { text: "Thank you! Our agent will respond shortly.", sender: "bot" }]);
    }, 500);
  };

  const validateForm = (name, value) => {
    switch (name) {
      case "name":
        return value.trim() ? "" : "error";
      case "mobile":
        return /^\+?\d{10,15}$/.test(value) ? "" : "error";
      case "email":
        return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? "" : "error";
      default:
        return "";
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: validateForm(name, value) }));
  };

  const handleQuickReply = (reply) => {
    setSelectedReply(reply);
    setShowForm(true);
    setMessages((prev) => [...prev, { text: reply, sender: "user" }]);
  };

  const handleFormSubmit = () => {
    const errors = {
      name: validateForm("name", formData.name),
      mobile: validateForm("mobile", formData.mobile),
      email: validateForm("email", formData.email),
    };
    setFormErrors(errors);
    if (Object.values(errors).some((error) => error)) return;
    setShowForm(false);
    setShowOtpInput(true);
    setMessages((prev) => [
      ...prev,
      { text: `OTP sent to ${formData.email}. Enter it below.`, sender: "bot" },
    ]);
  };

  const handleVerifyOtp = () => {
    if (!otp.trim()) return;
    setShowOtpInput(false);
    setMessages((prev) => [
      ...prev,
      { text: otp, sender: "user" },
      { text: `OTP verified! Connecting you now...`, sender: "bot" },
      { text: `👩‍⚕️ Hello ${formData.name}, how can I help you?`, sender: "agent" },
    ]);
  };

  const handleToggleChat = () => {
    if (!isOpen && messages.length === 0) {
      setMessages([
        {
          text: "Welcome to our Pharmacy Support System. Please select an option to proceed.",
          sender: "bot",
        },
      ]);
    }
    setIsOpen(!isOpen);
  };

  const quickReplies = [
    "Product/Medical Inquiry",
    "Order Status",
    "Prescription Upload",
    "Talk to Agent",
    "Request Call Back",
  ];

  return (
    <>
      {isOpen && (
        <div
          className="chat-container"
          style={{
            left: position.x - 260,
            top: position.y - 460,
          }}
        >
          <div className="chat-box">
            <div className="chat-header" onMouseDown={startDrag} onTouchStart={startDrag}>
              Pharmacy Support
              <span className="close-btn" onClick={() => setIsOpen(false)}>✕</span>
            </div>

            <div className="chat-body" ref={chatBodyRef}>
              {messages.map((msg, i) => (
                <div key={i} className={`chat-msg ${msg.sender}`}>{msg.text}</div>
              ))}

              {showForm && (
                <div className="contact-form">
                  {["name", "mobile", "email"].map((field) => (
                    <div className="input-group" key={field}>
                      <label htmlFor={field}>{field === "name" ? "Full Name" : field === "mobile" ? "Phone Number" : "Email Address"}</label>
                      <input
                        type={field === "email" ? "email" : field === "mobile" ? "tel" : "text"}
                        id={field}
                        name={field}
                        value={formData[field]}
                        onChange={handleFormChange}
                        className={formErrors[field] ? "error" : ""}
                        ref={field === "name" ? nameInputRef : null}
                      />
                    </div>
                  ))}
                  <div className="form-actions">
                    <button className="submit-btn" onClick={handleFormSubmit}>Submit</button>
                    <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                  </div>
                </div>
              )}

              {showOtpInput && (
                <div className="otp-section">
                  <div className="input-group">
                    <label htmlFor="otp">Enter OTP</label>
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                  <div className="form-actions">
                    <button className="submit-btn" onClick={handleVerifyOtp}>Verify OTP</button>
                    <button className="cancel-btn" onClick={() => setShowOtpInput(false)}>Cancel</button>
                  </div>
                </div>
              )}

              {!showForm && !showOtpInput && (
                <div className="quick-replies">
                  {quickReplies.map((reply, i) => (
                    <button key={i} onClick={() => handleQuickReply(reply)}>{reply}</button>
                  ))}
                </div>
              )}
            </div>

            <div className="chat-footer">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </div>
        </div>
      )}

      <div
        className="chat-circle-wrapper"
        style={{ left: position.x, top: position.y, position: "fixed" }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        onClick={handleToggleChat}
      >
        <div className="chat-circle-icon">💬</div>
      </div>
    </>
  );
};

export default ChatCircle;
