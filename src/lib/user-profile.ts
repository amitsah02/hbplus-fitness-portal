import type { User } from 'firebase/auth';

export type UserProfile = {
  uid: string;
  email: string;
  fullName: string;
  initial: string;
  emailVerified: boolean;
};

/** Shapes a Firebase user into the fields the UI needs. */
export function getUserProfile(user: User): UserProfile {
  const email = user.email ?? '';
  const fullName = user.displayName || email.split('@')[0] || 'Member';

  return {
    uid: user.uid,
    email,
    fullName,
    initial: fullName.charAt(0).toUpperCase(),
    emailVerified: user.emailVerified,
  };
}
