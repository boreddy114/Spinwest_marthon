"use client";
import { useState, useEffect } from 'react';
import PhotoGallery from '@/components/PhotoGallery';

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
        Spine, Orthopedics & Regenerative Medicine
      </div>
    </div>
  </div>
);

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleVolunteerAccess = () => {
    window.location.href = '/login';
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="premium-header">
        <div className="header-logo-container">
          <SpineWestLogo />
          <span className="logo-tagline">Marathon Event</span>
        </div>
        
        <button 
          onClick={handleVolunteerAccess}
          className="header-btn"
        >
          Volunteer Access
        </button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          
          {/* Hero Banner */}
          <div className="hero-banner animate-fade-in">
            <span className="hero-tag">Steamboat Springs Running Series</span>
            <h1 className="hero-title">Steamboat Springs Marathon 2026</h1>
            <p className="hero-subtitle">
              Relive your wonderful race memories. Scroll through the gallery below to find, view, and download your race day photos.
            </p>
            
            <div className="hero-sponsor-chips">
              <div className="sponsor-chip">
                Presented by <strong>Alpine Bank</strong>
              </div>
              <div className="sponsor-chip highlight">
                Sponsored by <strong>Spine West</strong>
              </div>
              <div className="sponsor-chip">
                June 7, 2026
              </div>
            </div>
          </div>

          {/* Gallery Title Area */}
          <div>
            <h2 className="gallery-section-title">Runner's Gallery</h2>
            <p className="gallery-section-subtitle">
              Browse the latest high-resolution captures from the trail. Click any image to download it instantly.
            </p>
            <PhotoGallery refreshTrigger={refreshTrigger} />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="premium-footer">
        <div className="footer-logo-wrap">
          <SpineWestLogo />
        </div>
        <p className="footer-info">
          Celebrating 25 years of excellence in patient care at Spine West. We specialize in spine, orthopedics, physical medicine & rehabilitation, and sports medicine to keep you running.
        </p>
        <div className="footer-credits">
          <p>© {new Date().getFullYear()} Spine West. All rights reserved. | <a href="/login">Volunteer Console</a></p>
          <p style={{ fontSize: '0.75rem', marginTop: '8px', opacity: 0.5 }}>Steamboat Marathon is presented by Alpine Bank and sponsored by Spine West.</p>
        </div>
      </footer>
    </div>
  );
}
