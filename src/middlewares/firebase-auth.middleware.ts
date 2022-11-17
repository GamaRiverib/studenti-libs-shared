import { Injectable, NestMiddleware } from '@nestjs/common';
import { initializeApp } from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { App } from 'firebase-admin/app';
import { DEFAULT_AUTHORIZATION_HEADER, User, USER_REQ_KEY } from '../auth';

const authorization_header =
  process.env.AUTHORIZATION_HEADER_INFO || 'authorization';

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {

  private firebaseApp: App;

  constructor() {
    this.firebaseApp = initializeApp();
  }

  async use(req: any, res: any, next: () => void) {
    try {
      const authorization = req.headers[DEFAULT_AUTHORIZATION_HEADER];
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
      if (!token) {
        const error = {
          statusCode: 403,
          timestamp: new Date().toISOString(),
          path: req.url,
          message: 'Invalid access token format',
        };
        console.error(error);
        res.status(403).send(error);
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
      console.error(reason);
    }
    const error = {
      statusCode: 401,
      timestamp: new Date().toISOString(),
      path: req.url,
      message: "Something was wrong"
    };
    res.status(401).send(error);
    return;
  }
}
