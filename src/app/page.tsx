'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import type { FormEvent, ChangeEvent } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    familyName: '',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.replace('/dashboard');
    }
  }, [status, session, router]);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage('Invalid email or password');
      } else if (result?.ok) {
        router.replace('/dashboard');
      }
    } catch (err) {
      setErrorMessage('Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isRegistering) {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        // After successful registration, sign in
        await handleSignIn();
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Registration failed');
      } finally {
        setIsLoading(false);
      }
    } else {
      await handleSignIn();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Show loading state only during initial session check
  if (status === 'loading') {
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Don't render anything if we're redirecting
  if (status === 'authenticated') {
    return null;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ mb: '100px' }}>
          <img src="/images/logo-light.png" alt="Logo" style={{ transform: 'scale(0.6)' }} />
        </Box>

        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {errorMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {isRegistering && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isLoading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="familyName"
                label="Family Name"
                name="familyName"
                autoComplete="family-name"
                value={formData.familyName}
                onChange={handleChange}
                disabled={isLoading}
              />
            </>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete={isRegistering ? 'new-password' : 'current-password'}
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              mt: 3,
              mb: 2,
              borderRadius: '9999px',
              background: 'linear-gradient(to right, #EF4136, #FBB040)',
              '&:hover': {
                background: 'linear-gradient(to right, #d63a30, #e09d3a)',
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              isRegistering ? 'Register' : 'Sign In'
            )}
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={() => setIsRegistering(!isRegistering)}
            disabled={isLoading}
            sx={{
              color: '#666',
            }}
          >
            {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
