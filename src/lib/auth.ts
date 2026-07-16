// Derive a stable session token from the configured password.
// Uses Web Crypto so it works in both the Edge middleware and Node route handlers.
export async function expectedToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${password}:strain-tracker-auth`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const AUTH_COOKIE = 'auth';