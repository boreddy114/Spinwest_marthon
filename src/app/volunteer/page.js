"use client";
import { useRouter } from 'next/navigation';
import IPadCamera from '@/components/IPadCamera';

export default function VolunteerPage() {
  const router = useRouter();

  const handleClose = () => {
    router.push('/');
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg-dark)', minHeight: '100vh' }}>
      <IPadCamera 
        mode="volunteer" 
        onClose={handleClose} 
        onPhotoTaken={() => {}} 
      />
    </div>
  );
}
