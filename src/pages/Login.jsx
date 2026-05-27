import React, { useState } from 'react';
import { User, ShieldCheck, Lock } from 'lucide-react'; 
import { useAuth } from '../context/AuthContext';

export default function Login({ onEnterAsVisitor, onAdminSuccess }) {
  const { login, loading, error } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(username, password);     
      
      if (result?.nextStep === "NEW_PASSWORD_REQUIRED") {
        alert("Primer accés: Cal definir una nova contrasenya a AWS.");
      } else {
        console.log("Accés concedit a PINTAPART 2026");
        if (onAdminSuccess) {
          onAdminSuccess();
        }
      }
    } catch (err) {
      console.error("Fallo en l'entrada d'administrador", err);
    }
  };

  return (
    <div className="fullscreen-loading">
      <div className="matrix-grid-bg">
        {Array(2500).fill(" PINTAPART 2026 ").map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
      
      <div className="role-container-horizontal">
        <div className="role-side user-side">
          <User size={50} color="black" />
          <h2 className="text-gradient2">USER</h2>
          <button onClick={onEnterAsVisitor} className="btn-explorar">
            <span>Visitant</span>
          </button>
        </div>

        <div className="role-divider-vertical"></div>
        <div className="role-side admin-side">
          <ShieldCheck size={50} color="black" />
          <h2 className="text-gradient1">ADMIN</h2>
          {!showForm ? (
            <>
              <p style={{color: 'black', fontSize: '1rem', marginBottom: '15px', fontWeight:'bolder'}}>AWS Cognito</p>
              <button onClick={() => setShowForm(true)} className="btn-retry" style={{width: '100%'}}>LOGIN</button>
            </>
          ) : (
            <form onSubmit={handleAdminLogin} className="login-form-fade">
              {error && <p style={{color: 'orange', fontSize: '0.8rem', marginBottom: '10px'}}>{error}</p>}
              
              <div className="input-group">
                <User size={18} /> 
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username" 
                  required 
                />
              </div>

              <div className="input-group">
                <Lock size={18} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="btn-retry" 
                style={{marginTop: '10px'}} 
                disabled={loading}
              >
                {loading ? "VERIFICANT..." : "ENTRAR"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-back">
                Enrere
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
