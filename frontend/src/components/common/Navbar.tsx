"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Multivendor Tracker
        </Link>
        
        <div className="flex space-x-4">
          {user ? (
            <>
              <span className="px-3 py-2">
                Welcome, {user.name} ({user.role})
              </span>
              
              {user.role === 'vendor' && (
                <Link 
                  href="/vendor" 
                  className={`px-3 py-2 rounded hover:bg-gray-700 ${
                    pathname.startsWith('/vendor') ? 'bg-gray-700' : ''
                  }`}
                >
                  Dashboard
                </Link>
              )}
              
              {user.role === 'delivery' && (
                <Link 
                  href="/delivery-partner" 
                  className={`px-3 py-2 rounded hover:bg-gray-700 ${
                    pathname.startsWith('/delivery-partner') ? 'bg-gray-700' : ''
                  }`}
                >
                  Dashboard
                </Link>
              )}
              
              <button 
                onClick={logout}
                className="px-3 py-2 rounded hover:bg-gray-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/auth/login" 
                className={`px-3 py-2 rounded hover:bg-gray-700 ${
                  pathname === '/auth/login' ? 'bg-gray-700' : ''
                }`}
              >
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className={`px-3 py-2 rounded hover:bg-gray-700 ${
                  pathname === '/auth/register' ? 'bg-gray-700' : ''
                }`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}