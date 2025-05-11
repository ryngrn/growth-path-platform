'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

export function Header() {
  const { data: session } = useSession();
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const userName = session?.user?.name || 'Your';

  // Hide header on the login page (root path)
  if (pathname === '/') return null;

  return (
    <header className="bg-gradient-to-r from-[#EF4136] to-[#FBB040] px-0 pt-8 pb-6 shadow-md">
      <div className="flex justify-center items-center w-full">
        <div className="flex items-center space-x-3">
          <Image 
            src="/images/logo-sm.png" 
            alt="GrowthPath Logo" 
            width={44} 
            height={44}
            priority
            className="w-[44px]"
          />
          <h1
            className="font-bold text-white drop-shadow-lg text-center"
            style={{ fontFamily: 'RocaOne, sans-serif', fontSize: 20 }}
          >
            {userName}&rsquo;s Family
          </h1>
        </div>
      </div>
    </header>
  );
} 