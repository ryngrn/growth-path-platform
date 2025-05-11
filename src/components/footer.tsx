'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, Search, AccountCircle } from '@mui/icons-material';

export function Footer() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // Hide footer on the login page (root path) or when not authenticated
  if (!isAuthenticated || pathname === '/') return null;

  const styles = {
    root: {
      position: 'fixed',
      bottom: 0,
      height: '64px',
      width: '100%',
      left: 0,
      borderRadius: '30px 30px 0 0',
    },
    selected: {
      color: '#ef5e2f !important',
    },
  };

  return (
    <Box sx={styles.root}>
      <BottomNavigation
        value={pathname}
        showLabels
        sx={{
          '& .MuiBottomNavigationAction-root.Mui-selected': {
            color: '#ef5e2f',
          },
          '& .MuiBottomNavigationAction-root': {
            color: 'rgba(0, 0, 0, 0.6)',
          },
        }}
      >
        <BottomNavigationAction
          label="Home"
          value="/dashboard"
          icon={<Home />}
          component={Link}
          href="/dashboard"
        />
        <BottomNavigationAction
          label="Discover"
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