import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // 1. Set up empty arrays for our REAL data
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/get-donations', {
          credentials: 'include' 
        });
        
        if (response.ok) {
          const data = await response.json();
          setDonations(data.donations); 
        } else {
          console.error("Failed to fetch donations. Are you logged in as Admin?");
        }
      } catch (error) {
        console.error("Server connection error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, []);
  

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-primary)' }}>
      
      <Sidebar isOpen={isSidebarOpen} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ margin: 0, fontSize: '2.2rem' }}>Overview</h1>
            <button style={{ 
              backgroundColor: 'var(--saffron)', color: '#FFF', border: 'none', padding: '12px 24px', 
              borderRadius: '4px', fontSize: '1rem', fontWeight: 600 
            }}>
              + Add Donation
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
            {[
              { label: 'Total Donations', value: 'NPR 1,245,000', color: 'var(--burgundy)' },
              { label: 'This Month', value: 'NPR 45,000', color: 'var(--text-primary)' },
              { label: 'Verified Receipts', value: '142', color: 'var(--trust-green)' },
              { label: 'Pending Verification', value: '3', color: 'var(--saffron)' }
            ].map((stat, i) => (
              <div key={i} style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '8px', borderTop: `3px solid ${stat.color}`, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>{stat.label}</div>
                <div style={{ fontSize: '1.8rem', color: stat.color, fontWeight: 700 }}>{stat.value}</div>
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-primary)' }}>Recent Transactions</h3>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'var(--bg-sidebar)', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                <tr>
                  <th style={{ padding: '15px 20px', fontWeight: 600 }}>Receipt ID</th>
                  <th style={{ padding: '15px 20px', fontWeight: 600 }}>Donor Name</th>
                  <th style={{ padding: '15px 20px', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '15px 20px', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '15px 20px', fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.95rem' }}>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Loading records...
                    </td>
                  </tr>
                ) : donations.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No donations found in the database.
                    </td>
                  </tr>
                ) : (
                  donations.map((dnt, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FAF6EE' }}>
                      <td style={{ padding: '15px 20px', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{dnt.id || dnt.receipt_id}</td>
                      <td style={{ padding: '15px 20px', fontWeight: 500 }}>{dnt.donor_name || dnt.name}</td>
                      <td style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>{dnt.date}</td>
                      <td style={{ padding: '15px 20px', fontWeight: 600 }}>NPR {dnt.amount}</td>
                      <td style={{ padding: '15px 20px' }}>
                        <span style={{ 
                          backgroundColor: dnt.status === 'Verified' ? 'var(--trust-green-light)' : '#FEF3E1', 
                          color: dnt.status === 'Verified' ? 'var(--trust-green)' : 'var(--saffron)',
                          padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600
                        }}>
                          {dnt.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}