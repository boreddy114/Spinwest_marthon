"use client";
import { useState, useEffect } from 'react';

export default function PhotoGallery({ refreshTrigger }) {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch(`/api/photos?t=${Date.now()}`);
        const data = await res.json();
        if (data.success) {
          setPhotos(data.photos);
        }
      } catch (err) {
        console.error("Failed to fetch photos", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, [refreshTrigger]);

  // Deep linking: Auto-open photo from query param on load
  useEffect(() => {
    if (isLoading || photos.length === 0) return;
    
    const searchParams = new URLSearchParams(window.location.search);
    const photoUrl = searchParams.get('photo');
    if (photoUrl) {
      const idx = photos.findIndex(p => p.url === photoUrl);
      if (idx !== -1) {
        setSelectedPhotoIndex(idx);
      }
    }
  }, [isLoading, photos]);

  // Keyboard navigation listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedPhotoIndex === null || photos.length === 0) return;
      if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex(prev => (prev - 1 + photos.length) % photos.length);
      } else if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex(prev => (prev + 1) % photos.length);
      } else if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, photos.length]);

  // Helper to load image, draw the frame around it, and trigger download
  const downloadFramedImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Prevent CORS tainted canvas errors
      img.src = url;
      img.onload = () => {
        const frameImg = new Image();
        frameImg.crossOrigin = 'anonymous';
        frameImg.src = '/frames/PHOTOFRAME_transparent.png';
        frameImg.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 1402;
          canvas.height = 1122;
          const ctx = canvas.getContext('2d');

          // Draw the photo first, scaled to cover the cutout (with 2px bleed)
          const targetX = 123;
          const targetY = 283;
          const targetW = 1153;
          const targetH = 662;

          const imgW = img.naturalWidth || img.width;
          const imgH = img.naturalHeight || img.height;
          const targetAspect = targetW / targetH;
          const imgAspect = imgW / imgH;

          let srcX = 0;
          let srcY = 0;
          let srcW = imgW;
          let srcH = imgH;

          if (imgAspect > targetAspect) {
            srcW = imgH * targetAspect;
            srcX = (imgW - srcW) / 2;
          } else {
            srcH = imgW / targetAspect;
            srcY = (imgH - srcH) / 2;
          }

          ctx.drawImage(img, srcX, srcY, srcW, srcH, targetX, targetY, targetW, targetH);

          // Draw transparent frame overlay on top
          ctx.drawImage(frameImg, 0, 0, 1402, 1122);

          try {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `steamboat-marathon-framed-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            resolve();
          } catch (e) {
            reject(e);
          }
        };
        frameImg.onerror = (e) => reject(e);
      };
      img.onerror = (e) => reject(e);
    });
  };

  const handleDownload = async (url) => {
    try {
      const photo = photos.find(p => p.url === url);
      // Cutoff time (approx 19:30 UTC / 13:30 Local) to detect old/raw photos
      const isRaw = photo && photo.time < 1779564600000;

      if (isRaw) {
        await downloadFramedImage(url);
        return;
      }

      if (url.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = url;
        link.download = `steamboat-marathon-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `steamboat-marathon-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed, falling back to opening in a new tab", err);
      window.open(url, '_blank');
    }
  };

  const handleImageError = async (photoUrl) => {
    // Remove from local state immediately
    setPhotos(current => current.filter(p => p.url !== photoUrl));
    
    // Call DELETE API to remove stale DB entry
    try {
      await fetch('/api/photos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: photoUrl })
      });
    } catch (err) {
      console.error("Failed to delete broken photo from DB:", err);
    }
  };

  const handleCopyLink = (url) => {
    const shareUrl = window.location.origin + '?photo=' + encodeURIComponent(url);
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error("Failed to copy URL:", err);
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (isLoading) {
    return <div className="text-center mt-4" style={{ color: 'var(--color-blue)', fontWeight: 600 }}>Loading amazing race moments... ✨</div>;
  }

  if (photos.length === 0) {
    return (
      <div className="text-center mt-4 p-5" style={{ background: '#fff', borderRadius: '16px', color: 'var(--color-text-muted-dark)', border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--color-slate-black)' }}>No photos uploaded yet!</h3>
        <p>Volunteers, please log in to upload race day pictures.</p>
      </div>
    );
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="premium-gallery-grid animate-fade-in">
        {photos.map((photo, i) => (
          <div 
            key={i} 
            className="gallery-card"
            onClick={() => setSelectedPhotoIndex(i)}
            style={photo.time < 1779564600000 ? { padding: 0, height: 'auto', display: 'block' } : {}}
          >
            {photo.time < 1779564600000 ? (
              <div className="dynamic-souvenir-frame">
                <div className="dynamic-frame-image-container">
                  <img 
                    src={photo.url} 
                    alt="Steamboat Springs Marathon" 
                    className="dynamic-frame-img" 
                    onError={() => handleImageError(photo.url)}
                  />
                </div>
                <img src="/frames/PHOTOFRAME_transparent.png" className="dynamic-frame-overlay-img" alt="Souvenir Frame" />
              </div>
            ) : (
              <img 
                src={photo.url} 
                alt="Steamboat Marathon race moment" 
                className="gallery-card-img"
                loading="lazy" 
                onError={() => handleImageError(photo.url)}
              />
            )}
            <div className="gallery-card-overlay">
              <span className="overlay-action-btn">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                View Details
              </span>
              <span className="overlay-photo-time">
                {photo.time ? new Date(photo.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Marathon Runner'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Modal */}
      {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
        <div className="lightbox-overlay" onClick={() => setSelectedPhotoIndex(null)}>
          
          {/* Navigation Arrows */}
          <button 
            className="lightbox-nav-btn prev"
            onClick={(e) => { 
              e.stopPropagation(); 
              setSelectedPhotoIndex(prev => (prev - 1 + photos.length) % photos.length); 
            }}
            aria-label="Previous photo"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button 
            className="lightbox-nav-btn next"
            onClick={(e) => { 
              e.stopPropagation(); 
              setSelectedPhotoIndex(prev => (prev + 1) % photos.length); 
            }}
            aria-label="Next photo"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem' }}>⛰️</span>
                <h3 className="lightbox-title" style={{ fontSize: '1.15rem' }}>Steamboat Marathon 2026</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="lightbox-photo-counter" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted-light)', fontFamily: "'Outfit', sans-serif", fontWeight: '600' }}>
                  Photo {selectedPhotoIndex + 1} of {photos.length}
                </span>
                <button className="lightbox-close-btn" onClick={() => setSelectedPhotoIndex(null)}>&times;</button>
              </div>
            </div>
            
            <div className="lightbox-body">
              <div className="lightbox-image-wrapper" style={{ width: '100%', maxWidth: '720px', background: 'transparent', border: 'none' }}>
                {photos[selectedPhotoIndex].time < 1779564600000 ? (
                  <div className="dynamic-souvenir-frame lightbox-frame" style={{ width: '100%', borderRadius: '12px' }}>
                    <div className="dynamic-frame-image-container">
                      <img 
                        src={photos[selectedPhotoIndex].url} 
                        alt="Steamboat Springs Marathon" 
                        className="dynamic-frame-img" 
                        onError={() => {
                          const badUrl = photos[selectedPhotoIndex].url;
                          setSelectedPhotoIndex(null);
                          handleImageError(badUrl);
                        }}
                      />
                    </div>
                    <img src="/frames/PHOTOFRAME_transparent.png" className="dynamic-frame-overlay-img" alt="Souvenir Frame" />
                  </div>
                ) : (
                  <img 
                    src={photos[selectedPhotoIndex].url} 
                    alt="Marathon runner" 
                    className="lightbox-image" 
                    onError={() => {
                      const badUrl = photos[selectedPhotoIndex].url;
                      setSelectedPhotoIndex(null);
                      handleImageError(badUrl);
                    }}
                  />
                )}
              </div>

              {/* Premium info panel */}
              <div className="lightbox-info-panel">
                <div className="info-panel-meta" style={{ textAlign: 'left' }}>
                  <div className="info-meta-title" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-green)', fontWeight: '800', letterSpacing: '0.08em', marginBottom: '4px', fontFamily: "'Outfit', sans-serif" }}>
                    Race Moment
                  </div>
                  <div className="info-meta-time" style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', fontFamily: "'Outfit', sans-serif" }}>
                    {photos[selectedPhotoIndex].time 
                      ? `Captured at ${new Date(photos[selectedPhotoIndex].time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      : 'Steamboat Springs, CO'}
                  </div>
                </div>

                {/* Sponsor badge */}
                <div className="lightbox-sponsor-badge" style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                  <span className="sponsor-badge-label" style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-muted-light)', fontWeight: '800', letterSpacing: '0.08em', fontFamily: "'Outfit', sans-serif" }}>
                    Photo Compliments of
                  </span>
                  <div className="sponsor-badge-logo-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: '20px' }}>
                    <svg width="18" height="18" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="22" r="11" fill="#8cc63f" />
                      <path d="M 5 45 C 35 48, 70 30, 115 15 C 80 44, 45 55, 5 45 Z" fill="#105aa3" />
                      <path d="M 78 41 C 75 48, 65 60, 56 75 C 46 90, 48 105, 58 115 C 50 110, 42 95, 50 80 C 58 65, 70 52, 78 41 Z" fill="#8cc63f" />
                    </svg>
                    <span className="sponsor-badge-brand" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem', fontWeight: '800', color: 'white', letterSpacing: '-0.02em' }}>
                      SPINE<span style={{ color: '#70b62c', marginLeft: '1px' }}>WEST</span>
                    </span>
                  </div>
                </div>

                {/* Actions row */}
                <div className="lightbox-actions-row">
                  <button 
                    onClick={() => handleDownload(photos[selectedPhotoIndex].url)}
                    className="lightbox-action-btn download"
                  >
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20" style={{ marginRight: '4px' }}>
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download Free
                  </button>

                  <button 
                    onClick={() => handleCopyLink(photos[selectedPhotoIndex].url)}
                    className="lightbox-action-btn share"
                  >
                    {copied ? (
                      <>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l-2.007 2.007a3.003 3.003 0 01-4.243-4.243l2.007-2.007A3.003 3.003 0 018.684 6.5M15.316 13.258l-2.007 2.007a3.003 3.003 0 01-4.243-4.243l2.007-2.007a3.003 3.003 0 014.243 0" />
                        </svg>
                        Share Link
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
