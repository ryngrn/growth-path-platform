'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <footer style={{
      top: '763px',
      position: 'absolute',
      height: '60px',
      width: '100%',
      left: 0,
      borderRadius: '0 0 30px 30px',
      overflow: 'hidden'
    }}>

      <div className="mobile-menu absolute bottom-0 left-1/2 -translate-x-1/2 max-w-[390px] w-full bg-white border-t border-gray-200">
        <nav className="flex justify-around items-center h-16">
          <Link 
            href="/dashboard" 
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive('/dashboard') ? 'text-[#EF4136]' : 'text-gray-600'
            }`}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs mt-1">Dashboard</span>
          </Link>

          <Link 
            href="/discover" 
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive('/discover') ? 'text-[#EF4136]' : 'text-gray-600'
            }`}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-xs mt-1">Discover</span>
          </Link>

          <Link 
            href="/account" 
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive('/account') ? 'text-[#EF4136]' : 'text-gray-600'
            }`}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-xs mt-1">Account</span>
          </Link>
        </nav>
      </div>
    </footer>
  );
} 