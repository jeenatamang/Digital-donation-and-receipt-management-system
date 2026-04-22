import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AddDonation from '../components/AddDonation';
import Receipt from '../components/Receipt';
import DigitalReceipts from '../components/DigitalReceipts';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('overview');
  const [selectedDonationId, setSelectedDonationId] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);


  const verifiedDonations = donations.filter(d => d.status === 'Verified');
  

  const totalDonationsAmount = verifiedDonations.reduce((sum, d) => sum + d.amount, 0);
  

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthAmount = verifiedDonations.filter(d => {
    const dDate = new Date(d.date);
    return dDate.getMonth() === currentMonth && dDate.getFullYear() === currentYear;
  }).reduce((sum, d) => sum + d.amount, 0);

  const verifiedCount = verifiedDonations.length;

  const pendingCount = donations.filter(d => d.status === 'Pending' || !d.status).length;

  const fetchDonations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/get-donations', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setDonations(data.donations);
      } else {
        console.error("Failed to fetch donations.");
      }
    } catch (error) {
      console.error("Server connection error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (donationId) => {
    setVerifyingId(donationId);
    try {
      const response = await fetch(`http://localhost:8000/donations/${donationId}/verify`, {
        method: 'PUT',
        credentials: 'include',
      });
      if (response.ok) {
        fetchDonations();
      } else {
        console.error('Failed to verify donation.');
      }
    } catch (error) {
      console.error('Server error:', error);
    } finally {
      setVerifyingId(null);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden var(--bg-primary)">

      <div className="print:hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">

        <div className="print:hidden">
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        <main className="flex-1 p-10 overflow-y-auto">

          {currentView === 'overview' && (
            <>
              <div className="flex justify-between items-center mb-7.5">
                <h1 className="m-0 text-4xl">Overview</h1>
                <button
                  onClick={() => setCurrentView('add')}
                  className="bg-saffron text-white border-none py-3 px-6 rounded text-base font-semibold cursor-pointer"
                >
                  + Add Donation
                </button>
              </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-t-4 border-t-[#5c1c24] p-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Donations</p>
              <p className="text-3xl font-bold text-[#5c1c24]">
                NPR {totalDonationsAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-t-4 border-t-black p-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">This Month</p>
              <p className="text-3xl font-bold text-black">
                NPR {thisMonthAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-t-4 border-t-[#2d7a5d] p-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Verified Receipts</p>
              <p className="text-3xl font-bold text-[#2d7a5d]">{verifiedCount}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-t-4 border-t-[#d47814] p-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pending Verification</p>
              <p className="text-3xl font-bold text-[#d47814]">{pendingCount}</p>
            </div>

          </div>

              <div className="bg-bg-card rounded-lg shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border-light">
                  <h3 className="m-0 text-xl text-text-primary">Recent Transactions</h3>
                </div>

                <table className="w-full border-collapse text-left">
                  <thead className="bg-bg-sidebar text-sm text-text-secondary uppercase">
                    <tr>
                      <th className="py-3.75 px-5 font-semibold">Receipt ID</th>
                      <th className="py-3.75 px-5 font-semibold">Donor Name</th>
                      <th className="py-3.75 px-5 font-semibold">Date</th>
                      <th className="py-3.75 px-5 font-semibold">Amount</th>
                      <th className="py-3.75 px-5 font-semibold">Status</th>
                      <th className="py-3.75 px-5 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-base">
                    {isLoading ? (
                      <tr>
                        <td colSpan="6" className="p-7.5 text-center text-text-muted">
                          Loading records...
                        </td>
                      </tr>
                    ) : donations.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-7.5 text-center text-text-muted">
                          No donations found in the database.
                        </td>
                      </tr>
                    ) : (
                      donations.map((dnt, i) => (
                        <tr key={i} className={`border-b border-border-light ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAF6EE]'}`}>
                          <td className="py-3.75 px-5 font-mono text-text-muted text-sm">{dnt.id || dnt.receipt_id}</td>
                          <td className="py-3.75 px-5 font-medium">{dnt.donor_name || dnt.name}</td>
                          <td className="py-3.75 px-5 text-text-secondary">{dnt.date}</td>
                          <td className="py-3.75 px-5 font-semibold">NPR {dnt.amount}</td>
                          <td className="py-3.75 px-5">
                            {dnt.status === 'Verified' ? (
                              <span className="py-1 px-2.5 rounded-full text-xs font-semibold bg-trust-green-light text-trust-green">
                                Verified
                              </span>
                            ) : (
                              <button
                                onClick={() => handleVerify(dnt.id || dnt.receipt_id)}
                                disabled={verifyingId === (dnt.id || dnt.receipt_id)}
                                className="py-1 px-2.5 rounded-full text-xs font-semibold bg-[#FEF3E1] text-saffron border border-saffron cursor-pointer hover:bg-saffron hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {verifyingId === (dnt.id || dnt.receipt_id) ? 'Verifying...' : 'Pending'}
                              </button>
                            )}
                          </td>
                          <td className="py-3.75 px-5 text-right">
                            <button
                              onClick={() => {
                                setSelectedDonationId(dnt.id || dnt.receipt_id);
                                setCurrentView('receipt');
                              }}
                              className="text-saffron hover:text-burgundy font-semibold text-sm transition-colors border border-saffron px-3 py-1 rounded bg-transparent cursor-pointer"
                            >
                              View Receipt
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {currentView === 'add' && (
            <AddDonation
              onCancel={() => setCurrentView('overview')}
              onSuccess={() => {
                setCurrentView('overview');
                fetchDonations();
              }}
            />
          )}

          {currentView === 'receipts' && (
            <DigitalReceipts
              donations={donations}
              isLoading={isLoading}
              onViewReceipt={(id) => {
                setSelectedDonationId(id);
                setCurrentView('receipt');
              }}
            />
          )}

          {currentView === 'receipt' && (
            <Receipt
              donationId={selectedDonationId}
              onBack={() => setCurrentView('overview')}
            />
          )}

        </main>

        <div className="print:hidden">
          <Footer />
        </div>

      </div>
    </div>
  );
}