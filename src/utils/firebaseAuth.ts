import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { User } from '../redux/slices/authSlice';

export async function loginWithEmail(email: string, password: string): Promise<User | null> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const u = cred.user;
  return {
    id: u.uid,
    email: u.email || email,
    fullName: (u as FirebaseUser & { displayName?: string }).displayName || u.email?.split('@')[0] || 'User',
  };
}

export async function signupWithEmail(
  fullName: string,
  email: string,
  password: string
): Promise<User | null> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: fullName });
  return {
    id: cred.user.uid,
    email: cred.user.email || email,
    fullName,
  };
}

export async function logoutFirebase(): Promise<void> {
  await signOut(auth);
}

export function getCurrentFirebaseUser() {
  return auth.currentUser;
}

export function onAuthStateChanged(callback: (user: User | null) => void) {
  return auth.onAuthStateChanged((fbUser) => {
    if (!fbUser) {
      callback(null);
      return;
    }
    callback({
      id: fbUser.uid,
      email: fbUser.email || '',
      fullName: (fbUser as FirebaseUser & { displayName?: string }).displayName || fbUser.email?.split('@')[0] || 'User',
    });
  });
}
