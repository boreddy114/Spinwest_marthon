"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// Custom Spine West Brand Logo
const SpineWestLogo = ({ size = 42 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head: Lime green circle */}
      <circle cx="50" cy="22" r="11" fill="#8cc63f" />
      {/* Upper body/Arms: Blue swoop */}
      <path d="M 5 45 C 35 48, 70 30, 115 15 C 80 44, 45 55, 5 45 Z" fill="#105aa3" />
      {/* Lower body/Leg: Green swoop */}
      <path d="M 78 41 C 75 48, 65 60, 56 75 C 46 90, 48 105, 58 115 C 50 110, 42 95, 50 80 C 58 65, 70 52, 78 41 Z" fill="#8cc63f" />
    </svg>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: `${size * 0.038}rem`, fontWeight: '800', lineHeight: '1.05', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em' }}>
        <span style={{ color: '#105aa3' }}>SPINE</span>
        <span style={{ color: '#8cc63f', marginLeft: '2px' }}>WEST</span>
      </div>
      <div style={{ fontSize: `${size * 0.013}rem`, fontWeight: '700', letterSpacing: '0.08em', color: '#105aa3', textTransform: 'uppercase', marginTop: '1px' }}>
        SPINE, ORTHOPEDICS & REGENERATIVE MEDICINE
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
          Enter the volunteer passcode to access the Spine West camera kiosk.
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
