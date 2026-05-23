"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// Custom Spine West Inline SVG Logo
const SpineWestLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="20" r="10" fill="#005bb7" />
      <path d="M50 35 C40 42, 40 55, 50 62" stroke="#70b62c" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M50 35 C60 42, 60 55, 50 62" stroke="#005bb7" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M30 45 C42 43, 45 43, 50 35 C55 43, 58 43, 70 45" stroke="#005bb7" strokeWidth="6" strokeLinecap="round" />
      <path d="M32 85 C42 74, 45 70, 50 62 C55 70, 58 74, 68 85" stroke="#70b62c" strokeWidth="6" strokeLinecap="round" />
    </svg>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: '1.1', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>
        <span style={{ color: '#005bb7' }}>SPINE</span>
        <span style={{ color: '#70b62c', marginLeft: '4px' }}>WEST</span>
      </div>
      <div style={{ fontSize: '0.55rem', fontWeight: '700', letterSpacing: '0.12em', color: '#94a3b8', textTransform: 'uppercase', marginTop: '2px' }}>
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
          <SpineWestLogo />
        </div>
        <h1 className="login-card-title">Volunteer Access</h1>
        <p className="login-card-subtitle">
          Please enter the volunteer passcode to unlock the camera kiosk portal.
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
          <a href="/" style={{ color: 'var(--color-blue)', fontSize: '0.9rem', fontWeight: '600' }}>
            &larr; Back to Runner's Gallery
          </a>
        </div>
      </div>
    </div>
  );
}
