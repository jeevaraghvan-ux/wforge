import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  applyActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
  signOut,
  updateProfile
} from "firebase/auth";

// Try reading config from localStorage first (for live in-browser entry), then .env
const getInitialConfig = () => {
  try {
    const saved = localStorage.getItem('wforge_firebase_config');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // ignore
  }
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAj_CpNR7jkL9opSfsQ-MaHZUIsdn5XhyM",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "wforge-5d281.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "wforge-5d281",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "wforge-5d281.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "706480287118",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:706480287118:web:3931d7bca870086a1048df",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
  };
};

export let firebaseConfig = getInitialConfig();

// Check if valid credentials have been provided
export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey && 
    firebaseConfig.apiKey !== "YOUR_API_KEY" && 
    !firebaseConfig.apiKey.includes("YOUR_")
  );
};

let app = null;
let auth = null;
let googleProvider = null;

const initFirebase = () => {
  try {
    if (isFirebaseConfigured()) {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      auth = getAuth(app);
      googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
    }
  } catch (error) {
    console.warn("Firebase initialization notice:", error);
  }
};

initFirebase();

export const updateFirebaseConfig = (newConfig) => {
  try {
    firebaseConfig = { ...firebaseConfig, ...newConfig };
    localStorage.setItem('wforge_firebase_config', JSON.stringify(firebaseConfig));
    initFirebase();
    return true;
  } catch (err) {
    console.error("Failed to update Firebase config:", err);
    return false;
  }
};

export { app, auth, googleProvider };

// Trigger real Google popup sign in
export const signInWithGooglePopup = async () => {
  if (!isFirebaseConfigured() || !auth || !googleProvider) {
    throw new Error("FIREBASE_NOT_CONFIGURED");
  }
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

// Sign up with Email & Password and send verification email
export const signUpWithFirebaseEmail = async (email, password, displayName) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error("FIREBASE_NOT_CONFIGURED");
  }
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && userCredential.user) {
    try {
      await updateProfile(userCredential.user, { displayName });
    } catch (e) {
      console.warn("Could not set displayName:", e);
    }
  }
  // Send the real Firebase email address verification email
  try {
    await sendEmailVerification(userCredential.user);
  } catch (err) {
    console.warn("Could not dispatch verification email automatically:", err);
  }
  return userCredential.user;
};

// Sign in with existing email and password
export const signInWithFirebaseEmail = async (email, password) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error("FIREBASE_NOT_CONFIGURED");
  }
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Send real password reset email via Firebase
export const sendFirebasePasswordReset = async (email) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error("FIREBASE_NOT_CONFIGURED");
  }
  return await sendPasswordResetEmail(auth, email);
};

// Resend email verification
export const resendFirebaseVerification = async () => {
  if (auth && auth.currentUser) {
    return await sendEmailVerification(auth.currentUser);
  }
  throw new Error("No active user to send verification to.");
};

// Handle incoming Firebase email verification action code
export const handleFirebaseEmailVerification = async (oobCode) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error("FIREBASE_NOT_CONFIGURED");
  }
  return await applyActionCode(auth, oobCode);
};

// Verify password reset code and return the associated email
export const verifyFirebaseResetCode = async (oobCode) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error("FIREBASE_NOT_CONFIGURED");
  }
  return await verifyPasswordResetCode(auth, oobCode);
};

// Confirm new password using the reset action code
export const confirmFirebasePasswordReset = async (oobCode, newPassword) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error("FIREBASE_NOT_CONFIGURED");
  }
  return await confirmPasswordReset(auth, oobCode, newPassword);
};

// Sign out from Firebase
export const signOutFirebase = async () => {
  if (auth) {
    await signOut(auth);
  }
};
