import { Navbar } from './Navbar';

export function Layout({ children, className = '' }) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
