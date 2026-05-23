"use client";
import { useState, useRef, useEffect } from 'react';

// Custom Spine West Brand Logo for Kiosk
const SpineWestKioskLogo = ({ size = 32 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head: Lime green circle */}
      <circle cx="50" cy="22" r="11" fill="#8cc63f" />
      {/* Upper body/Arms: Blue swoop */}
      <path d="M 5 45 C 35 48, 70 30, 115 15 C 80 44, 45 55, 5 45 Z" fill="#105aa3" />
      {/* Lower body/Leg: Green swoop */}
      <path d="M 78 41 C 75 48, 65 60, 56 75 C 46 90, 48 105, 58 115 C 50 110, 42 95, 50 80 C 58 65, 70 52, 78 41 Z" fill="#8cc63f" />
    </svg>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: `${size * 0.038}rem`, fontWeight: '800', lineHeight: '1.05', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em', color: 'white' }}>
        <span>SPINE</span>
        <span style={{ color: '#70b62c', marginLeft: '2px' }}>WEST</span>
      </div>
      <div style={{ fontSize: `${size * 0.013}rem`, fontWeight: '700', letterSpacing: '0.08em', color: '#94a3b8', textTransform: 'uppercase', marginTop: '1px' }}>
        Kiosk Portal
      </div>
    </div>
  </div>
);

export default function IPadCamera({ mode = 'volunteer', onPhotoTaken, onClose }) {
  const [facingMode, setFacingMode] = useState('environment');
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [zoom, setZoom] = useState(1);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Auto camera startup/cleanup based on preview state
  useEffect(() => {
    let currentStream = null;

    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false
        });
        currentStream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access failed:", err);
        setStatus("Error: Camera access denied. Check device settings.");
      }
    }

    if (!isReviewing) {
      startCamera();
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode, isReviewing]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Size canvas to video stream resolution
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    // Mirror front camera frames so text/layout is natural
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    // Zoom crop boundaries
    const sourceWidth = video.videoWidth / zoom;
    const sourceHeight = video.videoHeight / zoom;
    const sourceX = (video.videoWidth - sourceWidth) / 2;
    const sourceY = (video.videoHeight - sourceHeight) / 2;

    ctx.drawImage(
      video, 
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, canvas.width, canvas.height
    );
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedPhotos(prev => [...prev, dataUrl]);
  };

  const handleResetQueue = () => {
    setCapturedPhotos([]);
    setIsReviewing(false);
    setStatus('');
    setZoom(1);
  };

  const removePhoto = (index) => {
    const updated = capturedPhotos.filter((_, i) => i !== index);
    setCapturedPhotos(updated);
    if (updated.length === 0) {
      setIsReviewing(false);
    }
  };

  const handleUploadAll = async () => {
    if (capturedPhotos.length === 0) return;
    setStatus('Uploading photos to Runner\'s Gallery...');
    setIsProcessing(true);

    try {
      let successCount = 0;
      for (const data of capturedPhotos) {
        const res = await fetch('/api/upload-base64', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: data })
        });
        const uploadRes = await res.json();
        if (uploadRes.success) {
          successCount++;
        }
      }
      
      setStatus(`Success! Uploaded ${successCount} photos to the gallery.`);
      if (onPhotoTaken) onPhotoTaken();
    } catch (err) {
      console.error("Upload error", err);
      setStatus('Error: Upload failed. Please check network connections.');
    } finally {
      setTimeout(() => {
        handleResetQueue();
        setIsProcessing(false);
      }, 2000);
    }
  };

  return (
    <div className="kiosk-wrapper">
      {/* Hidden canvas for image grabs */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {!isReviewing ? (
        <>
          {/* Header */}
          <div className="kiosk-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Steamboat Springs Running Series Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 179, 0, 0.15)', border: '1px solid rgba(255, 179, 0, 0.3)', padding: '6px 12px', borderRadius: '20px' }}>
                <span style={{ fontSize: '1.1rem' }}>⛰️</span>
                <span className="kiosk-series-title" style={{ fontSize: '0.8rem', fontWeight: '800', fontFamily: "'Outfit', sans-serif", letterSpacing: '0.05em', color: 'var(--color-gold)' }}>STEAMBOAT RUNNING SERIES</span>
              </div>
              <div className="kiosk-header-divider" style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)' }} />
              <div className="kiosk-header-logo">
                <SpineWestKioskLogo />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button"
                onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')} 
                className="kiosk-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 0 0-9-9 9.7 9.7 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.7 9.7 0 0 0 6.74-2.74L21 16" />
                  <path d="M21 21v-5h-5" />
                  <path d="M15 10h-6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z" fill="currentColor" />
                  <circle cx="12" cy="13" r="1.5" fill="#1b2636" stroke="none" />
                  <path d="M12 9v1" stroke="currentColor" strokeWidth="1" />
                </svg>
                <span className="kiosk-btn-text">Flip</span>
              </button>
              <button 
                onClick={onClose} 
                className="kiosk-btn primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ display: 'inline-block' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="kiosk-btn-text">Finish & Exit</span>
              </button>
            </div>
          </div>

          {/* Viewport */}
          <div className="camera-feed-container">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="camera-feed"
              style={{ 
                transform: `scaleX(${facingMode === 'user' ? -zoom : zoom}) scaleY(${zoom})`,
              }} 
            />
          </div>

          {/* HUD controls */}
          <div className="kiosk-hud">
            {/* Zoom Slider */}
            <div className="zoom-controls-wrapper">
              <button className="zoom-btn" onClick={() => setZoom(z => Math.max(1, z - 0.5))}>-</button>
              <input 
                type="range" 
                min="1" 
                max="4" 
                step="0.1" 
                value={zoom} 
                onChange={(e) => setZoom(parseFloat(e.target.value))} 
                className="zoom-slider"
              />
              <button className="zoom-btn" onClick={() => setZoom(z => Math.min(4, z + 0.5))}>+</button>
            </div>

            {/* Quick Queue preview bar */}
            {capturedPhotos.length > 0 && (
              <div className="upload-queue-bar">
                {capturedPhotos.map((p, i) => (
                  <img 
                    key={i} 
                    src={p} 
                    className="queue-thumbnail" 
                    alt="thumbnail" 
                    onClick={() => setIsReviewing(true)}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
                <button 
                  onClick={() => setIsReviewing(true)}
                  className="kiosk-btn primary"
                  style={{ borderRadius: '30px', padding: '0.4rem 1.2rem', fontSize: '0.85rem' }}
                >
                  Review ({capturedPhotos.length}) &rarr;
                </button>
              </div>
            )}

            {/* Trigger Button */}
            <div className="camera-trigger-row">
              <button 
                onClick={handleCapture}
                className="trigger-btn"
                aria-label="Capture photo"
              />
            </div>
            
            {status && <div style={{ fontSize: '0.9rem', color: '#ff4d4d', marginTop: '4px' }}>{status}</div>}
          </div>
        </>
      ) : (
        /* Review Screen */
        <div className="review-overlay">
          <div className="review-card-container animate-fade-in">
            <h2 style={{ color: 'white', marginBottom: '8px', fontFamily: "'Outfit', sans-serif" }}>Review Captures</h2>
            <p style={{ color: 'var(--color-text-muted-light)', marginBottom: '2.5rem' }}>
              Confirm photos before adding them to the public Runner's Gallery.
            </p>

            <div className="review-thumbnails-row">
              {capturedPhotos.map((p, i) => (
                <div key={i} className="review-thumb-wrapper">
                  <img src={p} alt={`Captured photo ${i}`} />
                  <button 
                    onClick={() => removePhoto(i)} 
                    className="thumb-delete-btn"
                    title="Remove photo"
                    disabled={isProcessing}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className="review-actions-wrapper">
              <button 
                type="button" 
                onClick={() => setIsReviewing(false)} 
                disabled={isProcessing} 
                className="kiosk-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Take More
              </button>
              <button 
                type="button" 
                onClick={handleUploadAll} 
                disabled={isProcessing} 
                className="kiosk-btn primary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload {capturedPhotos.length} {capturedPhotos.length === 1 ? 'Photo' : 'Photos'}
                  </>
                )}
              </button>
            </div>
            
            {status && <div className="kiosk-status-text">{status}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
