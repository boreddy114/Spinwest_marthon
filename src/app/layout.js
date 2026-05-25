import './globals.css';

export const metadata = {
  title: 'Spine West Photo Gallery',
  description: 'View and download your event photos, brought to you by Spine West.',
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
