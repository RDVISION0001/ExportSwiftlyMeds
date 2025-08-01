import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock } from 'react-icons/fi';
import axiosInstance from '../../AuthContext/AxiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext/AuthContext';

function ScheduleCall() {
  const { id: ticketId } = useParams();
  const { token } = useAuth();
  console.log('token',token);
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSchedule = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!date || !time) {
      setError('Please select both date and time');
      return;
    }

    const payload = {
        date,
        time
      };

    try {
        setIsLoading(true);
    
    // Get token from storage (fallback if interceptor isn't working)
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    const response = await axiosInstance.put(`/ticket/schedule_call/${ticketId}`, payload );
    
      setSuccess(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to schedule call');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with Gradient and Logo */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">SwiftlyMeds</h1>
          <p className="text-sm">Schedule a Call</p>
        </div>

        {/* Form Section */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-4">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Call scheduled successfully!
              </div>
              <p>You'll be redirected shortly...</p>
            </div>
          ) : (
            <form onSubmit={handleSchedule} className="space-y-6">
              {/* Date Input */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                    min={new Date().toISOString().split('T')[0]} // Disable past dates
                  />
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Time Input */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                  />
                  <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Schedule Button */}
              <button
                type="submit"
                disabled={!date || !time || isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-2 px-4 rounded-md hover:from-blue-600 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Scheduling...' : 'Schedule Call'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScheduleCall;