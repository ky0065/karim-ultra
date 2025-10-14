import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Karim',
  description: 'Karim Ultra chatbot',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black dark:bg-gray-950 dark:text-white">
        {children}
      </body>
    </html>
  );
}
