import { useState, useRef, useCallback } from 'react';
import { FiUpload, FiX, FiCheck, FiImage } from 'react-icons/fi';
import { RxCross2 } from "react-icons/rx";
import axiosInstance from '../AuthContext/AxiosInstance';
import { useAuth } from '../AuthContext/AuthContext';
import Swal from 'sweetalert2';


export default function PrescriptionUpload({ onClose }) {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null);
  const { token, user,  setUploadPriscrption } = useAuth();
  console.log("fhg", user)
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFiles([...files, ...droppedFiles]);
    }
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles([...files, ...selectedFiles]);
    }
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };



  const handleSubmit = async () => {
    const email = user.swiftUserEmail;
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append("prescriptionData", JSON.stringify({ swiftUserEmail: email }));
      formData.append("file", files[0]);
      const response = await axiosInstance.post(
        `/swift/cart/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
     
      setUploadPriscrption(response.data.url)
      setLoading(false)
      Swal.fire({
        title: "Success!",
        text: response.message,
        icon: "success",
        confirmButtonText: "OK",
      });
      onClose(false);
    } catch (error) {
      console.log(error)
      setLoading(false)
      Swal.fire({
        title: "Upload Failed",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };





  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md  relative">
      <RxCross2 onClick={() => onClose(false)} className='absolute top-3 right-3 text-2xl cursor-pointer hover:text-red-400' />
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Your Prescription</h2>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <FiUpload className="w-12 h-12 text-blue-500" />
          <p className="text-gray-600">
            {isDragging ? 'Drop your files here' : 'Drag & drop your prescription here'}
          </p>
          <p className="text-gray-400 text-sm">or</p>
          <button
            onClick={triggerFileInput}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Browse Files
          </button>
          <p className="text-gray-400 text-sm">Supports: JPG, PNG, PDF (Max 5MB)</p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
          accept=".jpg,.jpeg,.png,.pdf"
          multiple
        />
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="font-medium text-gray-700">Uploaded Files</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FiImage className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <FiX />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
            }`}
        >
          {loading ? "Uploading..." : "Submit Prescription"}
        </button>
      )}

    </div >
  );
}