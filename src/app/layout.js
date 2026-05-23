import './globals.css';

export const metadata = {
  title: 'Steamboat Marathon 2026 - Spine West Gallery',
  description: 'View and download your race day photos from the 45th Annual Steamboat Springs Marathon, sponsored by Spine West.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
