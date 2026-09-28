const INTERNAL_EMAIL_DOMAIN = "internal.invalid";

const USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/;

export function usernameToEmail(username: string): string | null {
  const normalized = username.trim().toLowerCase();
  if (!USERNAME_PATTERN.test(normalized) || normalized.length > 64) {
    return null;
  }

  return `${normalized}@${INTERNAL_EMAIL_DOMAIN}`;
}

export function emailToUsername(email: string | undefined): string | null {
  if (!email) return null;
  const suffix = `@${INTERNAL_EMAIL_DOMAIN}`;
  if (!email.endsWith(suffix)) return null;
  return email.slice(0, -suffix.length);
}
