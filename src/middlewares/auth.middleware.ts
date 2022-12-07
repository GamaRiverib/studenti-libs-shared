import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { verify, Secret, VerifyOptions, decode, Algorithm } from 'jsonwebtoken';
import {
  API_GATEWAY_AUTHORIZATION_HEADER,
  DEFAULT_AUTHORIZATION_HEADER,
  User,
  USER_REQ_KEY,
} from '../auth';
import { AuthException } from './auth-exception';

export interface PublicKeyInfo {
  key_id: string;
  public_key: string;
  algorithm: Algorithm;
  expiration?: number;
}

const authorization_header =
  process.env.AUTHORIZATION_HEADER_INFO || DEFAULT_AUTHORIZATION_HEADER;

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly secretOrPublicKey?: Secret,
    private getPublicKey?: (
      kid: string,
    ) => Promise<PublicKeyInfo | null> | PublicKeyInfo | null,
    private readonly options?: VerifyOptions,
  ) {}

  async use(req: any, res: any, next: () => void) {
    try {
      let json: any;
      if (!req.headers || !req.headers[authorization_header]) {
        throw new AuthException('Missing access token');
      }
      if (authorization_header === DEFAULT_AUTHORIZATION_HEADER) {
        if (!req.headers[authorization_header].startsWith('Bearer ')) {
          throw new AuthException('Invalid scheme authorization');
        }
        const token = req.headers[authorization_header].split(' ')[1];
        const decoded: any = decode(token, { complete: true });
        if (typeof decoded !== 'object') {
          throw new AuthException('Invalid access token format');
        }
        let publicKey: Secret = this.secretOrPublicKey;
        if (decoded.header.kid && this.getPublicKey) {
          const publicKeyInfo: PublicKeyInfo = await this.getPublicKey(
            decoded.header.kid,
          );
          if (!this.options.algorithms) {
            this.options.algorithms = [];
          }
          if (publicKeyInfo) {
            this.options.algorithms.push(publicKeyInfo.algorithm as Algorithm);
            publicKey = publicKeyInfo.public_key;
          }
        }
        try {
          json = verify(token, publicKey, this.options);
        } catch (reason) {
          throw new AuthException(reason?.message || 'Token expired');
        }
        if (typeof json !== 'object') {
          throw new AuthException('Invalid access token format');
        }
      } else if (authorization_header === API_GATEWAY_AUTHORIZATION_HEADER) {
        let buffer = Buffer.from(
          req.headers[authorization_header].toString(),
          'base64',
        );
        const data = buffer.toString('ascii');
        json = JSON.parse(data); // TODO: test
      } else {
        throw new AuthException('Authorization header not supported');
      }
      if (!json) {
        throw new AuthException('Verification access token error');
      }
      const user = new User();
      user.id = json.sub;
      user.institute = json.institute;
      user.roles = json.roles || [];
      req[USER_REQ_KEY] = user;
      return next();
    } catch (reason: any) {
      throw new AuthException(reason?.message || 'Something was wrong');
    }
  }
}
