import logo from "../assets/thupten_dongak_logo.png";
import { useNavigate } from 'react-router-dom';

export default function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  
  const rawRole = localStorage.getItem('userRole') || 'donor';
  const roleDisplay = { 'admin': 'Admin', 'donor': 'User' };
  const displayRole = roleDisplay[rawRole] || 'User';

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/logout', { 
        method: 'POST',
        credentials: 'include' 
      });
      
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole'); 
      
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
      navigate('/'); 
    }
  };

  return (
    <header className="bg-white px-6 py-4 flex items-center justify-between shadow-md relative z-10">

      <div className="flex items-center gap-5">
        <button
          onClick={toggleSidebar}
          className="text-2xl text-gray-700 hover:text-black transition cursor-pointer"
        >
          ☰
        </button>

        <span className="font-semibold text-gray-600">
         Dashboard Overview
        </span>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1">
        <img
          src={logo}
          alt="Monastery logo"
          className="h-11 object-contain"
        />
        <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
          Thupten Dongak Choeling Sangha
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          Logged in as <b className="text-gray-800">{displayRole}</b>
        </span>

        <button 
          onClick={handleLogout}
          className="border border-red-800 text-red-800 px-3 py-1 rounded text-sm font-semibold hover:bg-red-800 hover:text-white transition cursor-pointer"
        >
          Log Out
        </button>
      </div>
    </header>
  );
}