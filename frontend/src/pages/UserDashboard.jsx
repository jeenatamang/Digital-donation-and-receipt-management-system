import { useState, useEffect } from 'react';
import Header from '../components/Header'; 
import Footer from '../components/Footer';
import { jsPDF } from "jspdf";

export default function UserDashboard() {
  const [myDonations, setMyDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchMyDonations = async () => {
      try {
        const response = await fetch('http://localhost:8000/get-donations', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setMyDonations(data.donations);
        } else {
          console.error("Failed to fetch donations.");
        }
      } catch (error) {
        console.error("Server connection error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyDonations();
  }, []);

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    
    const today = new Date().toISOString().split('T')[0];

    try {
      const response = await fetch('http://localhost:8000/add-donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          amount: parseFloat(amount),
          date: today
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: "Donation submitted! It is currently Pending." });
        setAmount('');
        setShowForm(false);

        const refreshed = await fetch('http://localhost:8000/get-donations', {
          credentials: 'include'
        });
        if (refreshed.ok) {
          const refreshedData = await refreshed.json();
          setMyDonations(refreshedData.donations);
        }

      } else {
        setMessage({ type: 'error', text: `Error: ${data.detail}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "System unavailable. Please try again later." });
    }
  };

  const handleDownloadReceipt = async (donationId) => {
    try {
      const response = await fetch(`http://localhost:8000/receipt/${donationId}`, {
        credentials: 'include' 
      });

      if (response.ok) {
        const data = await response.json();
        const receipt = data.receipt;
        const doc = new jsPDF();


        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(180, 0, 0); 
        doc.text("THUPTEN DONGAK MONASTERY", 105, 20, { align: "center" });

        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text("OFFICIAL DONATION RECEIPT", 105, 30, { align: "center" });


        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);


        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        
        doc.text(`Receipt Number: #${receipt.id}`, 20, 50);
        doc.text(`Date: ${receipt.date}`, 20, 60);
        doc.text(`Donor Name: ${receipt.name}`, 20, 70);
        doc.text(`Donor Email: ${receipt.email}`, 20, 80);

        doc.setFillColor(245, 245, 245);
        doc.rect(20, 95, 170, 30, "F"); 
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Donation Amount:", 30, 115);
        
        doc.setTextColor(0, 128, 0); 
        doc.text(`Rs.${receipt.amount.toFixed(2)} `, 120, 115);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont("helvetica", "italic");
        doc.text("Thank you for your generous support to the Sangha.", 105, 150, { align: "center" });

        doc.save(`Monastery_Receipt_${receipt.id}.pdf`);
      } else {
        alert("Failed to fetch receipt. Make sure you are authorized!");
      }
    } catch (error) {
      alert("System unavailable. Please try again later.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden var(--bg-primary)">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header /> 

        <main className="flex-1 p-10 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-4xl m-0 mb-2">My Giving Portal</h1>
            <p className="text-text-secondary text-lg">Thank you for your continuous support to the Thupten Dongak Choeling Sangha.</p>
          </div>

          {message && (
            <p className={`mb-4 font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </p>
          )}

          <div className="bg-bg-card rounded-lg shadow-sm overflow-hidden border border-border-light p-8 text-center">
            <h2 className="text-2xl text-text-primary mb-4">My Donation History</h2>

            {isLoading ? (
              <p className="text-text-muted">Loading your records...</p>
            ) : myDonations.length === 0 ? (
              <div className="py-10">
                <p className="text-text-muted mb-4">You haven't made any recorded donations yet.</p>

                <button
                  onClick={() => setShowForm(true)}
                  className="bg-saffron text-white border-none py-2 px-6 rounded font-semibold cursor-pointer"
                >
                  Make a Donation
                </button>

                {showForm && (
                  <form onSubmit={handleDonationSubmit} className="mt-6 flex flex-col items-center gap-4">
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="1"
                      required
                      className="border border-border-light rounded px-4 py-2 w-64 text-center"
                    />
                    <button
                      type="submit"
                      className="bg-saffron text-white border-none py-2 px-6 rounded font-semibold cursor-pointer"
                    >
                      Submit Donation
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setMessage(null); }}
                      className="text-text-muted underline text-sm cursor-pointer bg-transparent border-none"
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div>
                <table className="w-full border-collapse text-left">
                  <thead className="bg-bg-sidebar text-sm text-text-secondary uppercase">
                    <tr>
                      <th className="py-3 px-5 font-semibold">Receipt ID</th>
                      <th className="py-3 px-5 font-semibold">Date</th>
                      <th className="py-3 px-5 font-semibold">Amount</th>
                      <th className="py-3 px-5 font-semibold">Status</th>

                      <th className="py-3 px-5 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myDonations.map((dnt, i) => (
                      <tr key={i} className={`border-b border-border-light ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAF6EE]'}`}>
                        <td className="py-3 px-5 font-mono text-text-muted text-sm">{dnt.id}</td>
                        <td className="py-3 px-5 text-text-secondary">{dnt.date}</td>
                        <td className="py-3 px-5 font-semibold">NPR {dnt.amount}</td>
                        
                        <td className="py-3 px-5">
                          <span className={`py-1 px-2.5 rounded-full text-xs font-semibold ${
                            dnt.status === 'Verified'
                              ? 'bg-trust-green-light text-trust-green'
                              : 'bg-[#FEF3E1] text-saffron'
                          }`}>
                            {dnt.status || 'Pending'}
                          </span>
                        </td>

                        <td className="py-3 px-5 border-b text-center">
                          {dnt.status === 'Verified' ? (
                            <button 
                              onClick={() => handleDownloadReceipt(dnt.id)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-blue-800 transition cursor-pointer"
                            >
                              Download Receipt
                            </button>
                          ) : (
                            <span className="text-gray-500 italic">Pending...</span>
                          )}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-6 text-right">
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-saffron text-white border-none py-2 px-6 rounded font-semibold cursor-pointer"
                  >
                    Make a Donation
                  </button>

                  {showForm && (
                    <form onSubmit={handleDonationSubmit} className="mt-6 flex flex-col items-center gap-4">
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="1"
                        required
                        className="border border-border-light rounded px-4 py-2 w-64 text-center"
                      />
                      <button
                        type="submit"
                        className="bg-saffron text-white border-none py-2 px-6 rounded font-semibold cursor-pointer"
                      >
                        Submit Donation
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowForm(false); setMessage(null); }}
                        className="text-text-muted underline text-sm cursor-pointer bg-transparent border-none"
                      >
                        Cancel
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}