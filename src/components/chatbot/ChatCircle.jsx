import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { FaComment, FaTimes, FaPaperPlane, FaUser, FaPhone, FaPrescriptionBottleAlt, FaBoxOpen, FaQuestionCircle, FaExpand, FaCompress, FaSearchPlus, FaSearchMinus } from "react-icons/fa";
import { Link } from "react-router-dom";
import axiosInstance from "../../AuthContext/AxiosInstance";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useAuth } from "../../AuthContext/AuthContext";

const ChatCircle = () => {
  const { user } = useAuth()
  // console.log(user)
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [position, setPosition] = useState({
    x: window.innerWidth - 80,
    y: window.innerHeight - 80,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [typemsg, setTypeMsg] = useState(false)
  const [hasMoved, setHasMoved] = useState(false);
  const chatBodyRef = useRef(null);
  const nameInputRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const chatContainerRef = useRef(null);
  const [conversation, setConversation] = useState();
  const stompClientRef = useRef(null);

  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, conversation]);

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

  useEffect(() => {
    if (!isDragging) {
      setHasMoved(false);
    }
  }, [isDragging]);

  function formatDateTime(dateTimeStr) {
    const inputDate = new Date(dateTimeStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const inputDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
    const timeDiff = today - inputDay;
    const oneDayMs = 24 * 60 * 60 * 1000;

    const timeStr = inputDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(/^0/, '');

    if (timeDiff === 0) {
      return timeStr;
    } else if (timeDiff <= oneDayMs) {
      return `Yesterday, ${timeStr}`;
    } else {
      const dateStr = inputDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      return `${dateStr}, ${timeStr}`;
    }
  }

  const startDrag = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    setHasMoved(false);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    dragStart.current = { x: clientX, y: clientY };

    const onMove = (moveEvent) => {
      const moveX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
      const moveY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY);
      const dx = moveX - dragStart.current.x;
      const dy = moveY - dragStart.current.y;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        setHasMoved(true);
      }

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


  const handleToggleChat = (e) => {
    if (isDragging || hasMoved) {
      setIsDragging(false);
      setHasMoved(false);
      return;
    }

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

  const handleQuickReply = (text) => {
    connectWebSocket()
  }

  const connectWebSocket = () => {
    console.log("Connecting to WebSocket...");

    const socket = new SockJS("http://192.168.1.9:8081/ws");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WebSocket connected");
        setupSubscriptions(client);
        setTypeMsg(true)
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.body);
      },
      onWebSocketError: (error) => {
        console.error("WebSocket error:", error);
      },
    });
    client.activate();
    stompClientRef.current = client;
  };

  const setupSubscriptions = (client) => {
    getConversationId()
    client.subscribe(`/topic/inquiry-chat-${user.swiftUserEmail}`, (message) => {
      const newNotification = JSON.parse(message.body);
      console.log(newNotification)
      setConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, newNotification]
      }));
    });
  };

  const getConversationId = async () => {
    try {
      const response = await axiosInstance.get(`/auth/getConversation?email=${user.swiftUserEmail}` );
      console.log("Conversation Response:", response.data);
      setConversation(response.data.conversation)
      return response.data;
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  };



  const handelSendMessage = async () => {
    const response = await axiosInstance.post("/api/chat/send", {
      conversationId: conversation.id,
      senderType: "user",
      content: input
    })
    if (!input.trim()) return;
    setInput("");
    setConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, response.data]
    }));
  }

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
              id="messagebox"
            >
              {conversation && conversation.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-3 max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-snug relative animate-message-in ${msg.senderType === 'user'
                    ? 'ml-auto bg-gradient-to-r from-[#3d8287] to-[#09939d] text-white cursor-move select-none" onMouseDown={startDrag}] to-[#12b9c5] text-white rounded-br-sm'
                    : 'mr-auto bg-white text-gray-800 rounded-bl-sm shadow-sm'
                    }`}
                >
                  <div>{msg.content}</div>
                  <div className="text-xs opacity-70 text-right mt-1">
                    {formatDateTime(msg.timestamp)}
                  </div>
                </div>
              ))}
              {!typemsg ? (
                <div className="mt-3">
                  <h4 className="text-xs text-gray-500 mb-2 font-medium">Quick options:</h4>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickReply(reply.text)}
                        className="flex items-center gap-1 px-3 py-2 bg-white text-gray-700 border border-gray-200 rounded-full text-xs font-medium hover:bg-blue-50 hover:text-green-600 hover:border-blue-200 transition-colors"
                      >
                        {reply.icon && <span className="text-lg">{reply.icon}</span>}
                        <span>{reply.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-3 text-gray-500 text-sm">Let's start the chat</div>
              )}

            </div>

            {typemsg && <div className="p-3 bg-white border-t border-gray-200">
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#12b9c5] focus:border-[#12b9c5] text-gray-900 bg-white"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  aria-label="Type your message"
                />
                <button
                  onClick={handelSendMessage}
                  className="w-10 h-10 rounded-full bg-[#12b9c5] cursor-pointer text-white flex items-center justify-center hover:bg-[#458387] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={!input.trim()}
                >
                  <FaPaperPlane />
                </button>
              </form>
            </div>}
          </div>
        </div>
      )}

      <div
        className={`fixed w-14 h-14 rounded-full bg-[#12b9c5] flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all ${isOpen ? "hidden" : ""} ${isDragging ? "scale-110" : "scale-100"}`}
        style={{
          left: position.x,
          top: position.y,
          transform: isDragging ? 'scale(1.1)' : 'scale(1)',
        }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        onClick={(e) => {
          if (!hasMoved) {
            handleToggleChat(e);
          }
        }}
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