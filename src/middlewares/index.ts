import { NestMiddleware } from '@nestjs/common';
import { VerifyOptions, Algorithm, SignOptions, sign, Secret } from 'jsonwebtoken';
import { AuthMiddleware, PublicKeyInfo } from './auth.middleware';
import { FirebaseAuthMiddleware } from './firebase-auth.middleware';

export * from './auth-exception';
export * from './auth.middleware';
export * from './firebase-auth.middleware';

export function getAuthMiddleware(
  getPublicKeyInfo?: (
    kid: string,
  ) => Promise<PublicKeyInfo | null> | PublicKeyInfo | null,
): NestMiddleware {
  const secret = process.env.AUTH_MIDDLEWARE_SECRET || '';
  const algorithm = process.env.AUTH_MIDDLEWARE_ALGORITHM || 'HS256';
  const issuer =
    process.env.AUTH_MIDDLEWARE_ISSUER || 'https://gamarivera.dev/auth';
  const audience =
    process.env.AUTH_MIDDLEWARE_AUDIENCE || 'https://studenti.app';
  const ignoreExpiration = process.env.NODE_ENV?.toLowerCase() == 'test';
  const verifyOptions: VerifyOptions = {
    algorithms: [algorithm as Algorithm],
    issuer,
    audience,
    ignoreExpiration,
  };
  if (process.env.USE_AUTH_MIDDLEWARE?.toLowerCase() === 'true') {
    return new AuthMiddleware(secret, getPublicKeyInfo, verifyOptions);
  }
  return new FirebaseAuthMiddleware();
}

export function getTestAccessToken(subject: string, payload: any) {
  const secret = process.env.AUTH_MIDDLEWARE_SECRET || '';
  const issuer =
    process.env.AUTH_MIDDLEWARE_ISSUER || 'https://gamarivera.dev/auth';
  const audience =
    process.env.JWT_VALIDATOR_SMART_DEVICES_AUDIENCE || 'https://studenti.app';
  const expiresIn = '1h';
  const signOptions: SignOptions = {
    issuer,
    audience,
    expiresIn,
    subject,
  };
  return sign(payload, secret as Secret, signOptions);
}
