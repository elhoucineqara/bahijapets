"use client";

import { useState } from 'react';
import { Lock, Loader2, ShieldAlert } from 'lucide-react';

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Incorrect password.");
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container container animate-fade-in">
      <div className="login-card glass-card">
        <div className="login-header">
          <div className="lock-icon-container">
            <Lock size={24} />
          </div>
          <h2>Secure Console</h2>
          <p>Enter the administrator password to access the management of BahijaPets.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required
              className="form-input"
              autoFocus
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary login-btn">
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Connecting...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          padding: 40px 20px;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 40px;
          background: var(--bg-secondary);
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .lock-icon-container {
          background: var(--primary-glow);
          color: var(--primary-hover);
          padding: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          border: 1px solid var(--glass-border);
        }

        .login-header h2 {
          font-size: 1.6rem;
          font-weight: 800;
        }

        .login-header p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--danger);
          color: #fca5a5;
          padding: 12px;
          border-radius: var(--border-radius-sm);
          font-size: 0.85rem;
          font-weight: 500;
        }

        .login-btn {
          width: 100%;
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
