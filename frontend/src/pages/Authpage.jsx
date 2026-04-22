import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'http://localhost:8000/login' : 'http://localhost:8000/register';
    const bodyData = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        
        if (!isLogin) {
          setMessage("You have successfully registered as a user.");
          setEmail(''); 
          setPassword(''); 
          setName('');
        } else {
          setMessage("Log in successful. Redirecting to dashboard...");
          localStorage.setItem('userRole', data.role);
           console.log("Role received:", data.role); 
          console.log("Full response:", data);  
          
          setTimeout(() => {

            if (onLoginSuccess) onLoginSuccess(); 
            
            if (data.role === 'admin') {
              navigate('/admin-dashboard');
            } else {
              navigate('/user-dashboard');
            }
          }, 1000);
        }
      } else {
        setIsSuccess(false);
        setMessage(`Notice: ${data.detail}`);
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('System unavailable. Please try again later.');
    }
  };

  return (
    <div className="py-15 px-5 min-h-screen flex items-center justify-center">
      
      <div className="bg-bg-card p-10 rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.05)] border-t-4 border-gold max-w-112.5 w-full">
        
        <div className="text-center mb-7.5">
          <div className="font-['Cinzel',serif] text-[0.80rem] text-saffron tracking-[1px] uppercase mb-3.5 font-semibold leading-[1.4]">
            Secure Digital Donation & Receipt Management System
          </div>

          <h1 className="m-0 mb-2.5 text-[2.2rem] text-burgundy">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-text-secondary text-base m-0">
            {isLogin ? 'Please log in to continue.' : 'Create your secure account.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {!isLogin && (
            <div className="flex flex-col gap-2 text-left">
              <label className="text-[0.9rem] text-text-secondary font-semibold">FULL NAME</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="p-3 border border-border-input rounded font-['Lora'] text-base"
              />
            </div>
          )}
          
          <div className="flex flex-col gap-2 text-left">
            <label className="text-[0.9rem] text-text-secondary font-semibold">EMAIL ADDRESS</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="p-3 border border-border-input rounded font-['Lora'] text-base"
            />
          </div>
          
          <div className="flex flex-col gap-2 text-left">
            <label className="text-[0.9rem] text-text-secondary font-semibold">PASSWORD</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="p-3 border border-border-input rounded font-['Lora'] text-base"
            />
          </div>
          
          <button 
            type="submit" 
            className="mt-2.5 p-3.5 text-[1.1rem] bg-saffron text-white border-none rounded tracking-[1px] font-semibold cursor-pointer"
          >
            {isLogin ? 'Log In' : 'Create Account'}
          </button>
        </form>

        {message && (
          <div className={`mt-6.25 p-3.75 rounded text-center font-['Lora'] font-semibold border ${
            isSuccess 
              ? 'bg-trust-green-light text-trust-green border-trust-green' 
              : 'bg-[#FDECEA] text-alert-red border-alert-red'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-7.5 text-center border-t border-border-light pt-5">
          <span className="text-text-muted text-[0.9rem]">
            {isLogin ? "Don't have an account? " : "Already registered? "}
          </span>
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-saffron font-semibold cursor-pointer font-['Lora']"
          >
            {isLogin ? "Register here." : "Log in here."}
          </span>
        </div>

      </div>
    </div>
  );
}