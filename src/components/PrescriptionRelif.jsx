import { useEffect, useRef, useState } from 'react';
import { FaSearch, FaHistory, FaPlusCircle, FaBell, FaUserCircle } from 'react-icons/fa';
import { MdMedication, MdLocalPharmacy } from 'react-icons/md';

const PrescriptionRefills = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [searchQuery, setSearchQuery] = useState('');
  const topref = useRef(null);

  useEffect(() =>{
    topref.current?.scrollIntoView({ behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [])
  // Sample data
  const currentPrescriptions = [
    {
      id: 1,
      name: 'Lisinopril 10mg',
      dosage: 'Take 1 tablet daily',
      refills: 2,
      expires: '2023-12-15',
      pharmacy: 'CVS Pharmacy #1234',
      status: 'active'
    },
    {
      id: 2,
      name: 'Metformin 500mg',
      dosage: 'Take 1 tablet twice daily',
      refills: 0,
      expires: '2023-11-30',
      pharmacy: 'Walgreens #5678',
      status: 'needsRefill'
    }
  ];
  
  const pastPrescriptions = [
    {
      id: 3,
      name: 'Amoxicillin 250mg',
      dosage: 'Take 1 capsule every 8 hours',
      filled: '2023-05-10',
      expired: '2023-08-10',
      pharmacy: 'Rite Aid #9012'
    }
  ];

  const filteredCurrent = currentPrescriptions.filter(prescription =>
    prescription.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPast = pastPrescriptions.filter(prescription =>
    prescription.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={topref} className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 bg-white p-4 rounded-lg shadow">
            <nav>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center space-x-3 p-3 rounded-lg bg-blue-100 text-blue-700">
                    <MdMedication className="text-xl" />
                    <span>Prescription Refills</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                    <FaHistory className="text-xl" />
                    <span>Order History</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                    <MdLocalPharmacy className="text-xl" />
                    <span>My Pharmacies</span>
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Prescription Refills</h2>

              {/* Search and Add New */}
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search prescriptions..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
                  <FaPlusCircle />
                  <span>Add New Prescription</span>
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('current')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'current' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Current Medications
                  </button>
                  <button
                    onClick={() => setActiveTab('past')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'past' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Past Medications
                  </button>
                </nav>
              </div>

              {/* Prescription List */}
              {activeTab === 'current' ? (
                <div className="space-y-4">
                  {filteredCurrent.length > 0 ? (
                    filteredCurrent.map(prescription => (
                      <div key={prescription.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">{prescription.name}</h3>
                            <p className="text-gray-600">{prescription.dosage}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              <span className="font-medium">Pharmacy:</span> {prescription.pharmacy}
                            </p>
                          </div>
                          <div className="flex flex-col items-start md:items-end">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                prescription.status === 'needsRefill' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {prescription.status === 'needsRefill' ? 'Needs Refill' : 'Active'}
                              </span>
                              <span className="text-sm text-gray-500">
                                {prescription.refills} refill{prescription.refills !== 1 ? 's' : ''} left
                              </span>
                            </div>
                            <div className="space-x-2">
                              {prescription.status === 'needsRefill' ? (
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                                  Request Refill
                                </button>
                              ) : (
                                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm">
                                  View Details
                                </button>
                              )}
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                Transfer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No current prescriptions found</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPast.length > 0 ? (
                    filteredPast.map(prescription => (
                      <div key={prescription.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">{prescription.name}</h3>
                            <p className="text-gray-600">{prescription.dosage}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              <span className="font-medium">Pharmacy:</span> {prescription.pharmacy}
                            </p>
                          </div>
                          <div className="flex flex-col items-start md:items-end">
                            <div className="text-sm text-gray-500 mb-2">
                              <p>Filled: {prescription.filled}</p>
                              <p>Expired: {prescription.expired}</p>
                            </div>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                              Request Renewal
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No past prescriptions found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrescriptionRefills;