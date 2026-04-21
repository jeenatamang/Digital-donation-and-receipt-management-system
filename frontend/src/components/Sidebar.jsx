export default function Sidebar({ isOpen }) {
  return (
    <div style={{ 
      width: isOpen ? '260px' : '0px', 
      backgroundColor: 'var(--bg-dark)', 
      transition: 'width 0.3s ease',
      overflow: 'hidden',
      display: 'flex', 
      flexDirection: 'column',
      whiteSpace: 'nowrap'
    }}>
      <div style={{ padding: '30px 20px', textAlign: 'center', borderBottom: '1px solid var(--text-secondary)' }}>
        <h2 style={{ color: 'var(--gold)', margin: '0 0 5px 0', fontSize: '1.5rem' }}>Monastery Admin</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Secure Portal</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '30px 20px', fontSize: '1rem', fontWeight: 500 }}>
        <div style={{ color: '#FFF', cursor: 'pointer', borderLeft: '3px solid var(--saffron)', paddingLeft: '10px' }}>Dashboard Overview</div>
        <div style={{ color: 'var(--text-muted)', cursor: 'pointer', paddingLeft: '13px' }}>Add Donation</div>
        <div style={{ color: 'var(--text-muted)', cursor: 'pointer', paddingLeft: '13px' }}>Digital Receipts</div>
        <div style={{ color: 'var(--text-muted)', cursor: 'pointer', paddingLeft: '13px' }}>Donor Directory</div>
      </nav>
    </div>
  );
}