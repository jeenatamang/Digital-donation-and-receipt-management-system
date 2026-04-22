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

              <div className="grid grid-cols-4 gap-5 mb-10">
                {[
                  { label: 'Total Donations', value: 'NPR 1,245,000', textClass: 'text-burgundy', borderClass: 'border-burgundy' },
                  { label: 'This Month', value: 'NPR 45,000', textClass: 'text-text-primary', borderClass: 'border-text-primary' },
                  { label: 'Verified Receipts', value: '142', textClass: 'text-trust-green', borderClass: 'border-trust-green' },
                  { label: 'Pending Verification', value: '3', textClass: 'text-saffron', borderClass: 'border-saffron' }
                ].map((stat, i) => (
                  <div key={i} className={`bg-bg-card p-5 rounded-lg border-t-3 ${stat.borderClass} shadow-sm`}>
                    <div className="text-sm text-text-muted font-semibold mb-2 uppercase">{stat.label}</div>
                    <div className={`text-3xl font-bold ${stat.textClass}`}>{stat.value}</div>
                  </div>
                ))}
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
                            <span className={`py-1 px-2.5 rounded-full text-xs font-semibold ${
                              dnt.status === 'Verified' 
                                ? 'bg-trust-green-light text-trust-green' 
                                : 'bg-[#FEF3E1] text-saffron'
                            }`}>
                              {dnt.status || 'Pending'}
                            </span>
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