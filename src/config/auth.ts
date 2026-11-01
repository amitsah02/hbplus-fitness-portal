/**
 * Authentication configuration.
 *
 * The allowed domain is read from EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN.
 * If the variable is missing, it falls back to the production domain,
 * so a forgotten setting can never leave the testing domain active.
 *
 * Local testing (.env):   EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN=@rungta.org
 * Submission / Netlify:   EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN=@hbplus.fit
 */
const PRODUCTION_DOMAIN = '@hbplus.fit';

function normalizeDomain(value?: string): string {
  const trimmed = (value ?? '').trim().toLowerCase();
  if (!trimmed) return PRODUCTION_DOMAIN;
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
}

export const ALLOWED_EMAIL_DOMAIN = normalizeDomain(
  process.env.EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN,
);

// Same value without the "@", used as Google's hosted-domain hint.
export const ALLOWED_HOSTED_DOMAIN = ALLOWED_EMAIL_DOMAIN.slice(1);

export const IS_TESTING_DOMAIN = ALLOWED_EMAIL_DOMAIN !== PRODUCTION_DOMAIN;
