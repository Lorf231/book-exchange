import { db, firebaseConfig } from '@/lib/api/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile, connectAuthEmulator } from 'firebase/auth';
import { User } from '@/types/user';

export const userService = {

  async getAllUsers(): Promise<User[]> {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as User[];
  },

  async updateUserRole(userId: string, newRole: 'admin' | 'user'): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role: newRole });
  },

  async deleteUserDoc(userId: string): Promise<void> {
    await deleteDoc(doc(db, 'users', userId));
  },

  async createFullUser(data: { email: string, name: string }): Promise<string> {
    const tempPassword = Math.random().toString(36).slice(-8) + "Aa1"; 

    const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
    const secondaryAuth = getAuth(secondaryApp);

    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
       connectAuthEmulator(secondaryAuth, "http://127.0.0.1:9099");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, data.email, tempPassword);
      const newUser = userCredential.user;

      await updateProfile(newUser, { displayName: data.name });

      await setDoc(doc(db, 'users', newUser.uid), {
        uid: newUser.uid,
        email: data.email,
        name: data.name,
        role: 'user',
        createdAt: new Date().toISOString()
      });

      await secondaryAuth.signOut();
      
      return tempPassword;

    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    } finally {
      await deleteApp(secondaryApp);
    }
  }
};