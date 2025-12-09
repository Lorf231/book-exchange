import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

declare global {
  // eslint-disable-next-line no-var
  var _emulatorsConnected: boolean | undefined;
}

const firebaseConfig = {
  apiKey: "fake-api-key",
  authDomain: "localhost",
  projectId: "book-exchange-local",
  storageBucket: "book-exchange-local.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  if (!globalThis._emulatorsConnected) {
    
    console.log("🟢 [Firebase] Attempting to connect to Emulators...");

    try {
      connectAuthEmulator(auth, "http://127.0.0.1:9099");
      connectFirestoreEmulator(db, '127.0.0.1', 8080);
      connectStorageEmulator(storage, '127.0.0.1', 9199);

      console.log("✅ [Firebase] Connected to Emulators successfully!");
      
      // @ts-ignore
      globalThis._emulatorsConnected = true;
    } catch (error) {
      console.error("❌ [Firebase] Failed to connect to emulators:", error);
    }
  }
}

export { auth, db, storage, firebaseConfig };