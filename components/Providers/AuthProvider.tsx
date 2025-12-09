'use client';

import { useEffect } from 'react';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/api/firebase';
import { useAuthStore } from '@/lib/store/authStore';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          const userData = userDocSnap.exists() ? userDocSnap.data() : {};
          const role = userData.role || 'user';

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || userData.name,
            photoURL: firebaseUser.photoURL,
            role: role 
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth Error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <>
      <Toaster position="top-right" />
      {children}
    </>
  );
};