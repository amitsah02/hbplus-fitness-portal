import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';

import { ALLOWED_EMAIL_DOMAIN, ALLOWED_HOSTED_DOMAIN } from '../config/auth';
import { auth } from './firebase';

export const ACCESS_DENIED_MESSAGE =
  'Access restricted. Please login using your official domain email.';

/**
 * Turns a sign-in error into a short message for the user.
 * Returns null when the user simply closed the popup, so no error is shown.
 */
export function getAuthErrorMessage(error: unknown): string | null {
  const { code, message } = (error ?? {}) as { code?: string; message?: string };

  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return null;
    case 'auth/popup-blocked':
      return 'The sign-in popup was blocked. Allow popups for this site and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/unauthorized-domain':
      return 'This site is not authorized for sign-in yet. Please contact the administrator.';
    default:
      return message === ACCESS_DENIED_MESSAGE
        ? message
        : 'Unable to sign in. Please try again.';
  }
}

export function isAllowedEmail(email?: string | null): boolean {
  return !!email && email.trim().toLowerCase().endsWith(ALLOWED_EMAIL_DOMAIN);
}

/** A user is authorized only with an allowed domain AND a verified email. */
export function isAuthorizedUser(user: User | null): user is User {
  return !!user && isAllowedEmail(user.email) && user.emailVerified === true;
}

async function rejectIfUnauthorized(user: User): Promise<User> {
  if (!isAuthorizedUser(user)) {
    await signOut(auth);
    throw new Error(ACCESS_DENIED_MESSAGE);
  }
  return user;
}

export async function signInWithGoogleWeb(): Promise<User> {
  const provider = new GoogleAuthProvider();
  // "hd" is only a hint that filters Google's account picker.
  // The real check is isAuthorizedUser above.
  provider.setCustomParameters({
    prompt: 'select_account',
    hd: ALLOWED_HOSTED_DOMAIN,
  });

  const result = await signInWithPopup(auth, provider);
  return rejectIfUnauthorized(result.user);
}

export async function signInWithGoogleNative(idToken: string): Promise<User> {
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  return rejectIfUnauthorized(result.user);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}
