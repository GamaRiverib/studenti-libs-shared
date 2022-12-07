import { Injectable, NestMiddleware } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { DEFAULT_AUTHORIZATION_HEADER, User, USER_REQ_KEY } from '../auth';
import { AuthException } from './auth-exception';

const authorization_header =
  process.env.AUTHORIZATION_HEADER_INFO || DEFAULT_AUTHORIZATION_HEADER;

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {

  private firebaseApp: App;

  constructor() {
    this.firebaseApp = firebase.initializeApp();
  }

  async use(req: any, res: any, next: () => void) {
    try {
      if (!req.headers || !req.headers[authorization_header]) {
        throw new AuthException('Missing access token');
      }
      if (!req.headers[authorization_header].startsWith('Bearer ')) {
        throw new AuthException('Invalid scheme authorization');
      }
      const token = req.headers[authorization_header].split(' ')[1];
      if (!token) {
        throw new AuthException('Invalid access token format');
      }
      const auth = getAuth(this.firebaseApp);
      const decodedToken = await auth.verifyIdToken(token);
      const user = new User();
      user.id = decodedToken.uid;
      user.institute = decodedToken.institute;
      user.roles = decodedToken.roles || [];
      req[USER_REQ_KEY] = user;
      return next();
    } catch (reason: any) {
      throw new AuthException(reason?.message || 'Something was wrong');
    }
  }
}
