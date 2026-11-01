# HB+ Fitness Portal

A cross-platform portal for HB+ staff, built for the IT Intern assessment.
Users sign in with Google, and only accounts on the approved company domain
can reach the dashboard.

## Features

- Google sign-in (OAuth 2.0 through Firebase Authentication)
- Email-domain restriction with verified-email check
- Protected dashboard with automatic redirect to login when signed out
- Responsive layout: desktop sidebar, mobile menu, safe-area aware on Android and iOS
- Sections: Overview, My Profile, Fitness Resources, Security
- Session persistence on web (IndexedDB) and on Android/iOS (AsyncStorage)

## Tech stack

React Native, React Native Web, Expo Router, TypeScript, Firebase Authentication,
Google OAuth 2.0, EAS Build.

## Project structure

```
src/
  app/                    Routes (Expo Router)
    _layout.tsx           Providers and route protection
    index.tsx             Login screen
    dashboard.tsx         Dashboard layout (composes components)
  components/
    dashboard/            Header, Sidebar, MobileNav, WelcomeBanner,
                          AccountOverviewCards, ProfileDetails,
                          FitnessResources, SecuritySection, LogoutButton,
                          UserManagement (admin only)
    ui/                   Small shared pieces (Avatar, InfoRow, Panel)
  config/auth.ts          Allowed email domain
  hooks/use-is-mobile.ts  Breakpoint hook
  lib/
    auth.ts               Sign-in, sign-out, domain and verification checks
    firebase.ts           Firebase setup for web
    firebase.native.ts    Firebase setup for Android/iOS (persistence)
    firebase-config.ts    Reads Firebase values from env
    db.ts                 Firestore setup
    users.ts              User records and roles (Firestore)
    user-profile.ts       Maps a Firebase user to UI fields
  providers/
    auth-provider.tsx     Auth state and the useAuth hook
```

Authentication logic lives only in `lib/` and `providers/`. Components never
call Firebase directly except through `logout()`.

## Setup

Requires Node 22.13 or newer.

```bash
npm install
cp .env.example .env     # then fill in the values
npx expo start --web
```

### Environment variables

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_FIREBASE_*` | Firebase web app config |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Google OAuth web client |
| `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` | Google OAuth Android client |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | Google OAuth iOS client |
| `EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN` | Allowed domain. Defaults to `@hbplus.fit` |

`EXPO_PUBLIC_` values are compiled into the app bundle. Never put private
secrets in them. Firebase web keys are designed to be public, but restrict the
key to your domains in Google Cloud Console.

### Testing with another domain

Set `EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN=@rungta.org` in your local `.env`.
The dashboard shows a "Temporary testing domain" label while this is active.
For submission, remove the line or set it to `@hbplus.fit`.

## How access control works

1. The user signs in with Google (popup on web, ID token on Android/iOS).
2. The email must end with the allowed domain and be verified. If not, the
   user is signed out immediately and sees an access-restricted message.
3. `AuthProvider` listens to Firebase and only exposes authorized users.
4. `app/_layout.tsx` uses `Stack.Protected`, so `/dashboard` is unreachable
   without an authorized session and `/` is hidden once signed in.

### Security notes

- The domain check runs in the client, so on its own it protects the UI only.
  Someone could still call Firebase directly to create an account. The
  Firestore rules (`firestore.rules`) add server-side enforcement: only
  verified emails on the allowed domain can read or write any data. For
  blocking account creation itself, add a Firebase Auth blocking function
  (needs Identity Platform).
- The Google `hd` parameter only filters the account picker. It is a hint,
  not a control.
- Tokens are managed by the Firebase SDK. The app never stores or logs ID
  tokens itself.
- `.env` is git-ignored. Only `.env.example` is committed.

## Roles and user database (bonus)

Every user who signs in gets a record in Firestore at `users/{uid}`:

| Field | Meaning |
| --- | --- |
| `uid`, `email`, `displayName`, `photoURL` | Copied from the Google account |
| `role` | `"user"` (default) or `"admin"` |
| `createdAt`, `lastLoginAt` | Server timestamps |

- New users are always created as `user`.
- Admins see an extra **User Management** section where they can list users and
  promote or demote them. Normal users never see it.
- Role checks are enforced by `firestore.rules`, not only by the UI. Rules stop
  a user from changing their own role and allow only admins to change roles.
- If the database cannot be reached, the app treats the user as a plain `user`.

### Firestore setup

1. Firebase Console, **Firestore Database**, **Create database**.
2. Open the **Rules** tab, paste the contents of `firestore.rules`, and **Publish**.
3. Sign in once so your record is created.
4. **First admin:** in the Firestore data viewer open `users/<your uid>` and
   change the `role` field from `user` to `admin`. After that, admins can
   promote others from the app.
5. Before final submission, remove `rungta[.]org` from the `allowedDomain()`
   function in the rules and publish again.

## Android and iOS

Google sign-in does not work in Expo Go. Use a development build:

```bash
npm install -g eas-cli
eas login
eas build --profile development --platform android
```

In Google Cloud Console, create an Android OAuth client using package
`com.hbplus.auth` and the SHA-1 from `eas credentials`. iOS needs an Apple
Developer account and an iOS OAuth client with bundle ID `com.hbplus.auth`.

## Deploying the web app to Netlify

1. Push the repository to GitHub.
2. In Netlify, choose **Add new site, Import from Git** and pick the repo.
   `netlify.toml` already sets the build command (`npx expo export --platform web`),
   publish directory (`dist`) and Node version.
3. Under **Site settings, Environment variables**, add every variable from
   `.env.example`, with `EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN=@hbplus.fit`.
4. After the first deploy, add the Netlify domain in both places:
   - Firebase Console, Authentication, Settings, **Authorized domains**
   - Google Cloud Console, the web OAuth client, **Authorized JavaScript origins**
5. Redeploy if you changed environment variables, because they are read at build time.

## Scripts

| Command | Action |
| --- | --- |
| `npm run web` | Start the web dev server |
| `npm run android` / `npm run ios` | Start on a device or emulator |
| `npm run typecheck` | TypeScript check |
| `npm run build:web` | Production web build into `dist/` |

## Manual test checklist

- Signed out, opening `/dashboard` redirects to login
- Allowed-domain Google account reaches the dashboard
- Other Google accounts are rejected with a clear message
- Refreshing the dashboard keeps the session
- Logout returns to login, and the back button does not reopen the dashboard
- A normal user does not see User Management. An admin does, and can change roles
- A new login creates a `users/{uid}` document with role `user`
- Layout works at desktop width, narrow browser width and on a phone
