'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuthListner';
import { Toaster } from 'react-hot-toast';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  useAuth();

  return <>
  <Toaster position="top-right" />
  {children}
  </>;
};