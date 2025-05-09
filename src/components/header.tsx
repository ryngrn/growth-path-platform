'use client';

import { useSession } from 'next-auth/react';

export function Header() {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'Your';

  return (
    <header className="bg-gradient-to-r from-[#EF4136] to-[#FBB040] rounded-t-[30px] px-0 pt-8 pb-6 shadow-md">
      <div className="flex justify-center items-center w-full">
        <div className="flex items-center space-x-3">
          <img src="/images/logo-sm.png" alt="Logo" width={44} height={44} />
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