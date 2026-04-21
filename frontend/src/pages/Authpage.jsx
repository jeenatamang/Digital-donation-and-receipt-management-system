import { useState } from 'react';

// 1. ADD 'onLoginSuccess' inside the parentheses here
export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'http://127.0.0.1:8000/login' : 'http://127.0.0.1:8000/register';
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
          setEmail(''); setPassword(''); setName('');
        } else {
          setMessage("Log in successful. Redirecting to dashboard...");
          
          // 2. ADD THIS: Wait 1 second so they see the message, then switch pages!
          setTimeout(() => {
            if (onLoginSuccess) onLoginSuccess();
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
    <div style={{ padding: '60px 20px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        padding: '40px', 
        borderRadius: '8px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        borderTop: '4px solid var(--gold)',
        maxWidth: '450px',
        width: '100%'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            fontFamily: 'Cinzel, serif', 
            fontSize: '0.80rem', 
            color: 'var(--saffron)', 
            letterSpacing: '1px', 
            textTransform: 'uppercase', 
            marginBottom: '15px',
            fontWeight: 600,
            lineHeight: '1.4'
          }}>
            Secure Digital Donation & Receipt Management System
          </div>

          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.2rem', color: 'var(--burgundy)' }}>
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
            {isLogin ? 'Please log in to continue.' : 'Create your secure account.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>FULL NAME</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} 
                style={{ padding: '12px', border: '1px solid var(--border-input)', borderRadius: '4px', fontFamily: 'Lora', fontSize: '1rem' }} />
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>EMAIL ADDRESS</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
              style={{ padding: '12px', border: '1px solid var(--border-input)', borderRadius: '4px', fontFamily: 'Lora', fontSize: '1rem' }} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>PASSWORD</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} 
              style={{ padding: '12px', border: '1px solid var(--border-input)', borderRadius: '4px', fontFamily: 'Lora', fontSize: '1rem' }} />
          </div>
          
          <button type="submit" style={{ 
            marginTop: '10px', padding: '14px', fontSize: '1.1rem', backgroundColor: 'var(--saffron)', 
            color: '#FFF', border: 'none', borderRadius: '4px', letterSpacing: '1px', fontWeight: 600 
          }}>
            {isLogin ? 'Log In' : 'Create Account'}
          </button>
        </form>

        {message && (
          <div style={{ 
            marginTop: '25px', padding: '15px', borderRadius: '4px', textAlign: 'center',
            backgroundColor: isSuccess ? 'var(--trust-green-light)' : '#FDECEA',
            color: isSuccess ? 'var(--trust-green)' : 'var(--alert-red)',
            border: `1px solid ${isSuccess ? 'var(--trust-green)' : 'var(--alert-red)'}`,
            fontFamily: 'Lora', fontWeight: 600
          }}>
            {message}
          </div>
        )}

        <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isLogin ? "Don't have an account? " : "Already registered? "}
          </span>
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: 'var(--saffron)', fontWeight: 600, cursor: 'pointer', fontFamily: 'Lora' }}>
            {isLogin ? "Register here." : "Log in here."}
          </span>
        </div>

      </div>
    </div>
  );
}