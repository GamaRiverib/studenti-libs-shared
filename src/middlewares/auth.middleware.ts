import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify, Secret, VerifyOptions, decode, Algorithm } from 'jsonwebtoken';
import {
  API_GATEWAY_AUTHORIZATION_HEADER,
  DEFAULT_AUTHORIZATION_HEADER,
  User,
  USER_REQ_KEY,
} from '../auth';

export interface PublicKeyInfo {
  key_id: string;
  public_key: string;
  algorithm: Algorithm;
  expiration?: number;
}

const authorization_header =
  process.env.AUTHORIZATION_HEADER_INFO || 'authorization';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly secretOrPublicKey?: Secret,
    private getPublicKey?: (kid: string) => Promise<PublicKeyInfo | null> | PublicKeyInfo | null,
    private readonly options?: VerifyOptions,
  ) {
    console.debug({
      secretOrPublicKey,
      options,
    });
  }

  async use(req: any, res: any, next: () => void) {
    console.debug('AuthMiddleware.use');
    try {
      let json: any;
      if (!req.headers || !req.headers[authorization_header]) {
        const error = {
          statusCode: 401,
          timestamp: new Date().toISOString(),
          path: req.url,
          message: 'Missing access token',
        };
        console.error(error);
        res.status(401).send(error);
        return;
      }
      if (authorization_header === DEFAULT_AUTHORIZATION_HEADER) {
        if (!req.headers[authorization_header].startsWith('Bearer ')) {
          const error = {
            statusCode: 401,
            timestamp: new Date().toISOString(),
            path: req.url,
            message: 'Invalid scheme authorization',
          };
          console.error(error);
          res.status(401).send(error);
          return;
        }
        const token = req.headers[authorization_header].split(' ')[1];
        const decoded: any = decode(token, { complete: true });
        if (typeof decoded !== 'object') {
          const error = {
            statusCode: 403,
            timestamp: new Date().toISOString(),
            path: req.url,
            message: 'Invalid access token format',
          };
          console.error(error);
          res.status(403).send(error);
          return;
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
        json = verify(token, publicKey, this.options);
        if (typeof json !== 'object') {
          const error = {
            statusCode: 403,
            timestamp: new Date().toISOString(),
            path: req.url,
            message: 'Invalid access token format',
          };
          console.error(error);
          res.status(403).send(error);
          return;
        }
      } else if (authorization_header === API_GATEWAY_AUTHORIZATION_HEADER) {
        let buffer = Buffer.from(
          req.headers[authorization_header].toString(),
          'base64',
        );
        const data = buffer.toString('ascii');
        json = { payload: JSON.parse(data) };
      } else {
        const error = {
          statusCode: 400,
          timestamp: new Date().toISOString(),
          path: req.url,
          message: 'Authorization header not supported',
        };
        console.error(error);
        res.status(400).send(error);
      }
      if (!json) {
        const error = {
          statusCode: 400,
          timestamp: new Date().toISOString(),
          path: req.url,
          message: 'Verification access token error',
        };
        console.error(error);
        res.status(400).send(error);
        return;
      }
      const payload = json.payload;
      if (!payload) {
        const error = {
          statusCode: 400,
          timestamp: new Date().toISOString(),
          path: req.url,
          message: 'Verification access token error',
        };
        console.error(error);
        res.status(400).send(error);
        return;
      }
      const user = new User();
      user.id = payload.sub;
      user.institute = payload.institute;
      user.roles = payload.roles || [];
      req[USER_REQ_KEY] = user;
      return next();
    } catch (reason: any) {
      const error = {
        statusCode: 400,
        timestamp: new Date().toISOString(),
        path: req.url,
        message: 'Something was wrong',
      };
      res.status(400).send(error);
    }
  }
}
