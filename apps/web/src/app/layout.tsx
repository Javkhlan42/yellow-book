import type { Metadata } from 'next';
import './global.css';
import { AuthProvider } from '../components/AuthProvider';

export const metadata: Metadata = {
  title: 'YellowBook - Business Directory',
  description: 'Discover the best local businesses in your area on sharnom.systems',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
