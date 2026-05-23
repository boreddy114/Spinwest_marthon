"use client";
import { useState } from 'react';
import PhotoGallery from '@/components/PhotoGallery';

// Reusable Spine West Brand Logo
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
        <span style={{ color: '#005bb7' }}>SPINE</span>
        <span style={{ color: '#70b62c', marginLeft: '2px' }}>WEST</span>
      </div>
      <div style={{ fontSize: `${size * 0.013}rem`, fontWeight: '700', letterSpacing: '0.08em', color: '#64748b', textTransform: 'uppercase', marginTop: '1px' }}>
        Spine, Orthopedics & Medicine
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
          <SpineWestLogo size={38} />
          <span className="logo-tagline">Marathon Event</span>
        </div>
        
        <button 
          onClick={handleVolunteerAccess}
          className="header-btn"
        >
          Volunteer Portal
        </button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          
          {/* Hero Banner with Colorado Mountain Background */}
          <div className="hero-banner animate-fade-in">
            <span className="hero-tag">Steamboat Springs Running Series</span>
            <h1 className="hero-title">Steamboat Springs Marathon 2026</h1>
            <p className="hero-subtitle">
              Run alongside the roaring Elk River with the snow-capped Rocky Mountains of Colorado all around. Relive your race day memories and download your high-resolution photos below.
            </p>
            
            <div className="hero-sponsor-chips">
              <div className="sponsor-chip">
                Presented by <strong>Alpine Bank</strong>
              </div>
              <div className="sponsor-chip highlight">
                Sponsored by <strong>Spine West</strong>
              </div>
              <div className="sponsor-chip date-chip">
                June 7, 2026
              </div>
            </div>
          </div>

          {/* Quick Info Feature Blocks (Information Integration) */}
          <div className="info-feature-row animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            {/* Marathon Info Card */}
            <div className="info-card" style={{ background: '#ffffff', border: '1px solid rgba(46, 125, 50, 0.08)', borderRadius: '20px', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                <span style={{ background: 'rgba(2, 136, 209, 0.1)', color: 'var(--color-sky-blue)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 'bold' }}>🏃‍♂️</span>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--color-slate-black)', margin: 0 }}>Steamboat Marathon & 10K</h3>
              </div>
              <p style={{ color: 'var(--color-text-muted-dark)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                Ranked as one of the <strong>“Top 10 Destination Marathons in North America”</strong>, the Steamboat Marathon, Half Marathon, and 10K take runners through scenic valleys, past historic ranches, and alongside the roaring Elk River.
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted-dark)' }}>
                <strong>Distances:</strong> Marathon (26.2mi) • Half Marathon (13.1mi) • 10K (6.2mi)<br />
                <strong>Vibe:</strong> Casual, scenic, friendly, and community-driven.
              </div>
            </div>

            {/* Spine West Info Card */}
            <div className="info-card" style={{ background: '#ffffff', border: '1px solid rgba(46, 125, 50, 0.08)', borderRadius: '20px', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                <span style={{ background: 'rgba(112, 182, 44, 0.1)', color: 'var(--color-green)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 'bold' }}>💚</span>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--color-slate-black)', margin: 0 }}>Spine West Sports Medicine</h3>
              </div>
              <p style={{ color: 'var(--color-text-muted-dark)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                Specializing in non-surgical sports medicine, physical medicine & rehabilitation (PM&R), and advanced regenerative medicine. Our board-certified physicians use ultrasound, X-ray, and MRI to diagnose and treat back, joint, and nerve pain.
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted-dark)' }}>
                <strong>Goal:</strong> Keep you active, pain-free, and doing what you love (like running!).<br />
                <strong>Practice:</strong> Celebrating 25 years of care in Boulder, Colorado.
              </div>
            </div>
          </div>

          {/* Gallery Title Area */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 className="gallery-section-title">Runner's Gallery</h2>
            <p className="gallery-section-subtitle">
              Browse the latest high-resolution snapshots. Find your photo, click it, and download it instantly—completely free, no registration required.
            </p>
            <PhotoGallery refreshTrigger={refreshTrigger} />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="premium-footer" style={{ borderTop: '4px solid var(--color-green)' }}>
        <div className="footer-logo-wrap">
          <SpineWestLogo size={42} />
        </div>
        <p className="footer-info">
          Celebrating 25 years of excellence in patient care at Spine West. Specializing in spine, orthopedics, physical medicine, sports injuries, and regenerative medicine to keep runners on the move.
        </p>
        <div className="footer-credits">
          <p>© {new Date().getFullYear()} Spine West. All rights reserved. | <a href="/login">Volunteer Console</a></p>
          <p style={{ fontSize: '0.75rem', marginTop: '8px', opacity: 0.6 }}>
            Steamboat Marathon is presented by Alpine Bank and sponsored by Spine West. Clinic located at 5387 Manhattan Circle, Boulder, CO 80303.
          </p>
        </div>
      </footer>
    </div>
  );
}
