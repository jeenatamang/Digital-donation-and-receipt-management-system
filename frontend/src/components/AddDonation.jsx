import { useState } from 'react';

export default function AddDonation({ onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    donor_name: '',
    donor_email: '',
    amount: '',
    date: new Date().toISOString().split('T')[0], 
    status: 'Verified'
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/add-donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      });

      if (response.ok) {
        setMessage('Donation successfully recorded!');
        setIsError(false);
        setTimeout(() => onSuccess(), 1500); 
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.detail}`);
        setIsError(true);
      }
    } catch (error) {
      setMessage('Failed to connect to the server.');
      setIsError(true);
    }
  };

  return (
    <div className="bg-bg-card p-10 rounded-lg shadow-sm border-t-4 border-saffron max-w-2xl mx-auto mt-10">
      
      <div className="flex justify-between items-center mb-7.5 border-b border-border-light pb-5">
        <h2 className="m-0 text-3xl text-burgundy">Record New Donation</h2>
        <button onClick={onCancel} className="text-text-muted hover:text-alert-red font-semibold">
          Cancel &times;
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-secondary font-semibold">DONOR NAME</label>
            <input 
              type="text" name="donor_name" required value={formData.donor_name} onChange={handleChange}
              className="p-3 border border-border-input rounded font-['Lora'] text-base"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-secondary font-semibold">DONOR EMAIL</label>
            <input 
              type="email" name="donor_email" required value={formData.donor_email} onChange={handleChange}
              className="p-3 border border-border-input rounded font-['Lora'] text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-secondary font-semibold">AMOUNT (NPR)</label>
            <input 
              type="number" name="amount" required min="1" value={formData.amount} onChange={handleChange}
              className="p-3 border border-border-input rounded font-['Lora'] text-base"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-secondary font-semibold">DATE</label>
            <input 
              type="date" name="date" required value={formData.date} onChange={handleChange}
              className="p-3 border border-border-input rounded font-['Lora'] text-base"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-secondary font-semibold">STATUS</label>
            <select 
              name="status" value={formData.status} onChange={handleChange}
              className="p-3 border border-border-input rounded font-['Lora'] text-base bg-white"
            >
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <button type="submit" className="mt-5 p-3.5 text-lg bg-trust-green text-white border-none rounded tracking-wide font-semibold">
          Submit Donation
        </button>

      </form>

      {message && (
        <div className={`mt-5 p-3.5 rounded text-center font-['Lora'] font-semibold border ${
          isError ? 'bg-red-50 text-alert-red border-alert-red' : 'bg-trust-green-light text-trust-green border-trust-green'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}