import logo from '../assets/thupten_dongak_logo.png';

export default function Header({ toggleSidebar }) {
  return (
    <header style={{ 
      backgroundColor: 'var(--bg-card)', 
      padding: '15px 30px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      zIndex: 10,
      position: 'relative' 
    }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button 
          onClick={toggleSidebar}
          style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--burgundy)', padding: 0 }}
        >
          ☰
        </button>
        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Financial Dashboard</span>
      </div>

      <div style={{ 
        position: 'absolute', 
        left: '50%', 
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <img 
          src={logo} 
          alt="Monastery logo" 
          style={{ height: '45px', width: 'auto', objectFit: 'contain' }} 
        />
        
        <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.2rem', color: 'var(--burgundy)' }}>
          <span style={{ color: 'var(--gold)' }}></span>
        </span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Logged in as <b>Admin</b></span>
        <button style={{ 
          backgroundColor: 'transparent', border: '1px solid var(--burgundy)', color: 'var(--burgundy)', 
          padding: '6px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600
        }}>
          Log Out
        </button>
      </div>
    </header>
  );
}