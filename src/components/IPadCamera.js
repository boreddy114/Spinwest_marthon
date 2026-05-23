"use client";
import { useState, useRef, useEffect } from 'react';

// Custom Spine West Brand Logo for Kiosk
const SpineWestKioskLogo = ({ size = 32 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="24" r="9" fill="#70b62c" />
      <path d="M25 50 C45 35, 75 35, 95 50" stroke="#005bb7" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M48 44 C48 68, 80 84, 98 62" stroke="#70b62c" strokeWidth="9" strokeLinecap="round" fill="none" />
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
            <div className="kiosk-header-logo">
              <SpineWestKioskLogo />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button"
                onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')} 
                className="kiosk-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Flip
              </button>
              <button onClick={onClose} className="kiosk-btn primary">
                Finish & Exit
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
                  <img key={i} src={p} className="queue-thumbnail" alt="thumbnail" />
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

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button 
                type="button" 
                onClick={() => setIsReviewing(false)} 
                disabled={isProcessing} 
                className="kiosk-btn"
                style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', borderRadius: '30px' }}
              >
                Take More
              </button>
              <button 
                type="button" 
                onClick={handleUploadAll} 
                disabled={isProcessing} 
                className="kiosk-btn primary"
                style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem', borderRadius: '30px', flexGrow: 1 }}
              >
                {isProcessing ? 'Uploading to Gallery...' : `Upload ${capturedPhotos.length} ${capturedPhotos.length === 1 ? 'Photo' : 'Photos'} to Gallery`}
              </button>
            </div>
            
            {status && <div className="kiosk-status-text">{status}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
