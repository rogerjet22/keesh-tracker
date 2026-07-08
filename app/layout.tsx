import './globals.css';
import React from 'react';

export const metadata = {
  title: 'KEESH Dashboard',
  description: 'Internal operations dashboard'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-6xl mx-auto p-6">{children}</div>
      </body>
    </html>
  );
}
