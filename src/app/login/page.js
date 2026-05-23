"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// Custom Spine West Brand Logo
const SpineWestLogo = ({ size = 42 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="24" r="9" fill="#70b62c" />
      <path d="M25 50 C45 35, 75 35, 95 50" stroke="#005bb7" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M48 44 C48 68, 80 84, 98 62" stroke="#70b62c" strokeWidth="9" strokeLinecap="round" fill="none" />
    </svg>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: `${size * 0.038}rem`, fontWeight: '800', lineHeight: '1.05', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em' }}>
        <span style={{ color: '#005bb7' }}>SPINE</span>
        <span style={{ color: '#70b62c', marginLeft: '2px' }}>WEST</span>
      </div>
      <div style={{ fontSize: `${size * 0.013}rem`, fontWeight: '700', letterSpacing: '0.08em', color: '#64748b', textTransform: 'uppercase', marginTop: '1px' }}>
        Spine, Orthopedics & Medicine
      </div>
    </div>
  </div>
);

export default function Login() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    const volunteerPasscode = process.env.NEXT_PUBLIC_VOLUNTEER_PASSCODE || 'spinewest';

    if (passcode.toLowerCase() === volunteerPasscode.toLowerCase()) {
      Cookies.set('event_auth', 'true', { expires: 1 }); // expires in 1 day
      Cookies.set('user_role', 'volunteer', { expires: 1 });
      router.push('/volunteer');
    } else {
      setError('Incorrect passcode. Please try again.');
    }
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-card animate-fade-in">
        <div className="login-header-logo">
          <SpineWestLogo size={42} />
        </div>
        <h1 className="login-card-title">Volunteer Access</h1>
        <p className="login-card-subtitle">
          Enter the volunteer passcode to access the camera kiosk.
        </p>
        
        <form onSubmit={handleLogin}>
          <input 
            type="password" 
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Volunteer Passcode" 
            className="login-input-field"
            autoFocus
          />
          {error && <p className="login-error-msg">{error}</p>}
          <button 
            type="submit" 
            className="login-submit-btn"
          >
            Access Camera Kiosk
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', borderTop: '1px solid #edf2f7', paddingTop: '1.25rem' }}>
          <a href="/" style={{ color: 'var(--color-forest)', fontSize: '0.9rem', fontWeight: '700' }}>
            &larr; Back to Runner's Gallery
          </a>
        </div>
      </div>
    </div>
  );
}
