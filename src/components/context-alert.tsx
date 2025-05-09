import React from 'react';

interface ContextAlertProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}

export function ContextAlert({ message, type = 'info', className = '' }: ContextAlertProps) {
  const bgColor = {
    info: 'bg-blue-50 text-blue-800',
    success: 'bg-green-50 text-green-800',
    warning: 'bg-yellow-50 text-yellow-800',
    error: 'bg-red-50 text-red-800',
  }[type];

  return (
    <div className={`p-4 rounded-lg ${bgColor} ${className}`}>
      {message}
    </div>
  );
} 