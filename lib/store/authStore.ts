import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types/user";
import { auth, db } from "@/lib/api/firebase"; 
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import type { LoginCredentials, RegisterCredentials } from "@/types/auth";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface AuthActions {
  login: (creds: LoginCredentials) => Promise<void>;
  signup: (creds: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

interface IAuthStore extends AuthState, AuthActions {}

const initialState : AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
};

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user, 
        isLoading: false 
      }),

      setLoading: (isLoading) => set({ isLoading }),

      login: async ({ email, password }) => {
        set({ isLoading: true });
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const { uid, displayName, photoURL } = userCredential.user;
          
          const userDocRef = doc(db, "users", uid);
          const userDocSnap = await getDoc(userDocRef);
          
          let role: 'user' | 'admin' = 'user';
          
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            role = data.role || 'user';
          }

          set({ 
            user: { 
              uid, 
              email: userCredential.user.email, 
              displayName, 
              photoURL,
              role
            }, 
            isAuthenticated: true 
          });
        } catch (error) {
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async ({ email, password, name }) => {
        set({ isLoading: true });
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(userCredential.user, { displayName: name });
          
          const { uid, photoURL } = userCredential.user;

          await setDoc(doc(db, "users", uid), {
            uid,
            name,
            email,
            role: 'user',
            createdAt: new Date().toISOString()
          });

          set({ 
            user: { 
              uid, 
              email: userCredential.user.email, 
              displayName: name, 
              photoURL,
              role: 'user'
            }, 
            isAuthenticated: true 
          });
        } catch (error) {
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await signOut(auth);
          set({ user: null, isAuthenticated: false });
          localStorage.removeItem("auth-storage"); 
        } catch (error) {
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);