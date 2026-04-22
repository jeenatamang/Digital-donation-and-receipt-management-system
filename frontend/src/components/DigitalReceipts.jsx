import { useState } from 'react';

export default function DigitalReceipts({ donations, isLoading, onViewReceipt }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDonations = donations.filter(dnt => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = (dnt.donor_name || dnt.name || '').toLowerCase().includes(searchLower);
    const idMatch = (dnt.id || dnt.receipt_id || '').toString().includes(searchTerm);
    return nameMatch || idMatch;
  });

  return (
    <>
      <div className="flex justify-between items-center mb-7.5">
        <h1 className="m-0 text-4xl">Digital Receipts</h1>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72 px-4 py-2.5 border border-border-light rounded-md focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron text-text-primary"
          />
        </div>
      </div>

      <div className="bg-bg-card rounded-lg shadow-sm overflow-hidden">
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
            ) : filteredDonations.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-7.5 text-center text-text-muted">
                  {searchTerm ? 'No receipts match your search.' : 'No receipts found.'}
                </td>
              </tr>
            ) : (
              filteredDonations.map((dnt, i) => (
                <tr key={i} className={`border-b border-border-light hover:bg-[#FDF9F1] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAF6EE]'}`}>
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
                      onClick={() => onViewReceipt(dnt.id || dnt.receipt_id)}
                      className="text-saffron hover:text-burgundy font-semibold text-sm transition-colors border border-saffron hover:border-burgundy px-3 py-1 rounded bg-transparent cursor-pointer"
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
  );
}