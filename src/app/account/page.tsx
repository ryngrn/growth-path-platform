'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { updateUserProfile } from '@/app/api/user/route';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
      });
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await updateUserProfile(formData);
      if (response.ok) {
        setSuccess('Profile updated successfully');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="600px" mx="auto" p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Account Settings
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          margin="normal"
          required
          disabled
        />

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {success && (
          <Typography color="success.main" sx={{ mt: 2 }}>
            {success}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Update Profile'}
        </Button>
      </form>
    </Box>
  );
} 