import { useState, useEffect } from 'react';

export default function LoginGate({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('strokeMitraAuth') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      localStorage.setItem('strokeMitraAuth', 'true');
      setIsLoggedIn(true);
      setShowForm(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('strokeMitraAuth');
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  if (isLoggedIn) {
    return (
      <>
        {children}
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
        <style>{`
          .logout-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: hsl(var(--color-primary));
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 2px 8px rgba(8, 145, 178, 0.2);
          }
          .logout-btn:hover {
            background: hsl(188, 78%, 31%);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(8, 145, 178, 0.3);
          }
          .menu-btn {
            display: none !important;
          }
        `}</style>
      </>
    );
  }

  return (
    <div className="login-gate">
      <div className="login-hero-bg">
        <div className="login-blob login-blob-1" />
        <div className="login-blob login-blob-2" />
        <div className="login-blob login-blob-3" />
      </div>
      <div className="login-hero-grid" />

      <div className="login-content">
        <h1 className="login-title">
          Welcome to <span className="login-title-accent">Stroke Mitra</span>
        </h1>
        <p className="login-subtitle">
          AI-powered stroke screening. Please login to continue.
        </p>

        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="login-btn-primary">
            Login
          </button>
        ) : (
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
            <button type="submit" className="login-btn-submit">
              Submit
            </button>
          </form>
        )}
      </div>

      <style>{`
        .login-gate {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #F0FAFA 0%, #FFFFFF 100%);
          overflow: hidden;
          z-index: 10000;
        }

        .login-hero-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .login-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
          animation: lp-blob-drift 12s ease-in-out infinite;
        }

        .login-blob-1 {
          width: 600px;
          height: 600px;
          background: #14B8A6;
          top: -150px;
          left: -100px;
          animation-delay: 0s;
        }

        .login-blob-2 {
          width: 500px;
          height: 500px;
          background: #0D9488;
          bottom: -100px;
          right: -80px;
          animation-delay: -4s;
        }

        .login-blob-3 {
          width: 350px;
          height: 350px;
          background: #2DD4BF;
          top: 40%;
          left: 50%;
          animation-delay: -8s;
          opacity: 0.15;
        }

        .login-hero-grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(8, 145, 178, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(8, 145, 178, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        .login-content {
          position: relative;
          z-index: 2;
          max-width: 480px;
          text-align: center;
          padding: 0 24px;
        }

        .login-title {
          font-family: var(--lp-font-head, 'Inter', sans-serif);
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.04em;
          margin-bottom: 16px;
          color: #0F4C5C;
        }

        .login-title-accent {
          background: linear-gradient(90deg, #0891B2, #0D9488);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .login-subtitle {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #5F8A96;
          margin-bottom: 32px;
        }

        .login-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 40px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          text-decoration: none;
          border: none;
          background: linear-gradient(135deg, #0891B2, #0F4C5C);
          color: #FFFFFF;
          box-shadow: 0 4px 20px rgba(8, 145, 178, 0.25);
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .login-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(8, 145, 178, 0.35);
          filter: brightness(1.08);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 320px;
          margin: 0 auto;
          animation: fadeIn 0.3s ease-out;
        }

        .login-input {
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid rgba(178, 224, 224, 0.5);
          background: #FFFFFF;
          font-size: 0.95rem;
          color: #1F4E5F;
          transition: all 0.2s;
        }

        .login-input:focus {
          outline: none;
          border-color: #0891B2;
          box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
        }

        .login-input::placeholder {
          color: #5F8A96;
        }

        .login-btn-submit {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          border: none;
          background: linear-gradient(135deg, #0891B2, #0F4C5C);
          color: #FFFFFF;
          box-shadow: 0 4px 20px rgba(8, 145, 178, 0.25);
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          margin-top: 8px;
        }

        .login-btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(8, 145, 178, 0.35);
          filter: brightness(1.08);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
