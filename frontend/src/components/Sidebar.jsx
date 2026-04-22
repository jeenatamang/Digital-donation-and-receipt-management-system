import { useState } from 'react'; 

export default function Sidebar({ isOpen, currentView, setCurrentView }) {
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
        
      } else {
        setMessage({ type: 'error', text: `Error: ${data.detail}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "System unavailable. Please try again later." });
    }
  };
  return (
    <aside className={`bg-[#1A2332] text-white h-full flex flex-col transition-all duration-300 overflow-hidden ${isOpen ? 'w-64' : 'w-0'}`}>
      
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-saffron text-center m-0">Monastery Admin</h2>
        <p className="text-gray-400 text-xs text-center mt-2 tracking-widest uppercase">Secure Portal</p>
      </div>


      <nav className="flex-1 mt-6">

        <button 
          onClick={() => setCurrentView('overview')}
          className={`w-full text-left px-8 py-4 text-base font-medium transition-colors cursor-pointer border-none block ${
            currentView === 'overview' 
              ? 'border-l-4 border-saffron text-white bg-white/5' 
              : 'text-gray-400 hover:text-white bg-transparent border-l-4 border-transparent hover:bg-white/5'
          }`}
        >
          Dashboard Overview
        </button>

        <button 
          onClick={() => setCurrentView('add')}
          className={`w-full text-left px-8 py-4 text-base font-medium transition-colors cursor-pointer border-none block ${
            currentView === 'add' 
              ? 'border-l-4 border-saffron text-white bg-white/5' 
              : 'text-gray-400 hover:text-white bg-transparent border-l-4 border-transparent hover:bg-white/5'
          }`}
        >
          Add Donation
        </button>


        <button 
          onClick={() => setCurrentView('receipts')} 
          className={`w-full text-left px-8 py-4 text-base font-medium transition-colors cursor-pointer border-none block ${
            currentView === 'receipts' 
              ? 'border-l-4 border-saffron text-white bg-white/5' 
              : 'text-gray-400 hover:text-white bg-transparent border-l-4 border-transparent hover:bg-white/5'
          }`}
        >
          Digital Receipts
        </button>
        

      </nav>
    </aside>
  );
}