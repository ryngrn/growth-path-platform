'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

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
    setIsLoading(true);

    try {
      await handleSignIn();

      // If we're registering, create the user
      if (isRegistering) {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to create user');
        }
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
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
      <div className="mt-2 w-full flex flex-col items-center">
        <CircularProgress />
      </div>
    );
  }

  // Don't render anything if we're redirecting
  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mt-8 flex flex-col items-center">
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
            ) : isRegistering ? 'Register' : 'Sign In'}
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
      </div>
    </div>
  );
}
