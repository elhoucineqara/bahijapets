import crypto from 'crypto';

export function isAuthorized(request) {
  const sessionCookie = request.cookies.get('admin_session')?.value;
  if (!sessionCookie) return false;

  const adminPassword = process.env.ADMIN_PASSWORD || "BahijaPets2026!";
  const sessionSecret = process.env.SESSION_SECRET || "default_secret_string";

  const expectedToken = crypto
    .createHmac('sha256', sessionSecret)
    .update(adminPassword)
    .digest('hex');

  return sessionCookie === expectedToken;
}
