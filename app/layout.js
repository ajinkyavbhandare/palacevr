// app/layout.jsx
import './globals.css'; // Make sure your Tailwind CSS is imported
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Palace - Immersive Video Platform',
  description: 'Discover and create 180° video content.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}