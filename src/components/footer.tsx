'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, Search, AccountCircle } from '@mui/icons-material';

export function Footer() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const styles = {
    root: {
      position: 'fixed',
      bottom: 0,
      height: '64px',
      width: '100%',
      left: 0,
      borderRadius: '30px 30px 0 0',
    },
  };

  return (
    <Box sx={styles.root}>
      <BottomNavigation
        value={pathname}
        showLabels
      >
        <BottomNavigationAction
          label="Home"
          value="/dashboard"
          icon={<Home />}
          component={Link}
          href="/dashboard"
        />
        <BottomNavigationAction
          label="Search"
          value="/search"
          icon={<Search />}
          component={Link}
          href="/search"
        />
        <BottomNavigationAction
          label="Account"
          value="/account"
          icon={<AccountCircle />}
          component={Link}
          href="/account"
        />
      </BottomNavigation>
    </Box>
  );
} 