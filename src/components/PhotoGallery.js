"use client";
import { useState, useEffect } from 'react';

export default function PhotoGallery({ refreshTrigger }) {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch('/api/photos');
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

  const handleDownload = async (url) => {
    try {
      // Direct base64 download
      if (url.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = url;
        link.download = `steamboat-marathon-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      
      // Remote URL download via Blob to force save dialogue
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
            onClick={() => setSelectedPhoto(photo.url)}
          >
            <img 
              src={photo.url} 
              alt="Steamboat Marathon race moment" 
              className="gallery-card-img"
              loading="lazy" 
              onError={() => setPhotos(current => current.filter(p => p.url !== photo.url))}
            />
            <div className="gallery-card-overlay">
              <span className="overlay-action-btn">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                View & Download
              </span>
              <span className="overlay-photo-time">
                {photo.time ? new Date(photo.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Marathon Runner'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Modal */}
      {selectedPhoto && (
        <div className="lightbox-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-header">
              <h3 className="lightbox-title">Steamboat Marathon Moments</h3>
              <button className="lightbox-close-btn" onClick={() => setSelectedPhoto(null)}>&times;</button>
            </div>
            <div className="lightbox-body">
              <div className="lightbox-image-wrapper">
                <img src={selectedPhoto} alt="Marathon runner" className="lightbox-image" />
              </div>
              <div className="lightbox-footer">
                <button 
                  onClick={() => handleDownload(selectedPhoto)}
                  className="download-btn"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" style={{ marginRight: '4px' }}>
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download High-Res Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
