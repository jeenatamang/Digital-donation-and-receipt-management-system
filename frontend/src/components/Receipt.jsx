import { useState, useEffect } from 'react';
import logo from "../assets/thupten_dongak_logo.png";

export default function Receipt({ donationId, onBack }) {
  const [receipt, setReceipt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await fetch(`http://localhost:8000/receipt/${donationId}`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setReceipt(data.receipt);
        } else {
          setError('Failed to load receipt details.');
        }
      } catch (err) {
        setError('Server connection error.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceipt();
  }, [donationId]);

  if (isLoading) return <div className="p-10 text-center text-text-muted">Loading receipt...</div>;
  if (error) return <div className="p-10 text-center text-alert-red">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10">

      <div className="flex justify-between mb-5 print:hidden">
        <button onClick={onBack} className="text-text-muted hover:text-text-primary font-semibold cursor-pointer border-none bg-transparent">
          &larr; Back to Dashboard
        </button>
        <button 
          onClick={() => window.print()} 
          className="bg-trust-green text-white py-2 px-6 rounded font-semibold shadow-sm cursor-pointer border-none"
        >
          Print Receipt
        </button>
      </div>

      <div className="bg-white p-12 border border-border-light shadow-sm rounded-lg print:shadow-none print:border-none print:p-0">
        

        <div className="text-center border-b-2 border-saffron pb-8 mb-8">
          
          <img 
            src={logo} 
            alt="Sangha Logo" 
            className="h-24 mx-auto mb-4 object-contain" 
          />

          <h1 className="text-3xl text-burgundy m-0 font-['Lora'] font-bold">
            Thupten Dongak Choeling Sangha
          </h1>
          <p className="text-lg text-burgundy font-medium mt-1 mb-3">
            Founded by: H.H. Trulshik Rinpoche
          </p>
          
          <p className="text-text-secondary text-sm">
            Branch Office: Boudhanath Stupa Area, Kathmandu, Bagmati Province, Nepal
          </p>
          <p className="text-text-secondary text-sm">
            Email: contact@thuptenchoelingsangha.org | Tel: +977-1-4567890, +977-9800000000
          </p>
        </div>

        <div className="flex justify-between items-start mb-10">
          <div>
            <p className="text-sm text-text-muted font-bold uppercase mb-1">Received From</p>
            <p className="text-xl font-semibold m-0">{receipt.name}</p>
            <p className="text-text-secondary">{receipt.email}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-muted font-bold uppercase mb-1">Receipt Details</p>
            <p className="m-0 font-mono text-text-secondary">Receipt #: {receipt.id.toString().padStart(6, '0')}</p>
            <p className="m-0 text-text-secondary">Date: {receipt.date}</p>
            <p className="m-0 text-text-secondary mt-1">
              Status: <span className="font-bold">{receipt.status}</span>
            </p>
          </div>
        </div>


        <table className="w-full border-collapse mb-12">
          <thead>
            <tr className="bg-gray-50 border-y border-border-light text-left">
              <th className="py-4 px-5 font-semibold text-text-primary">Description</th>
              <th className="py-4 px-5 font-semibold text-text-primary text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-6 px-5 border-b border-border-light text-lg">General Donation</td>
              <td className="py-6 px-5 border-b border-border-light text-right text-lg font-semibold">
                NPR {receipt.amount.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-between items-end mt-20 pt-10 border-t border-border-light">
          <p className="text-text-muted text-sm italic">Thank you for your generous support.</p>
          <div className="text-center">
            <div className="border-b border-text-primary w-40 mb-2"></div>
            <p className="text-sm font-semibold uppercase text-text-secondary m-0">Authorized Signature</p>
          </div>
        </div>

      </div>
    </div>
  );
}