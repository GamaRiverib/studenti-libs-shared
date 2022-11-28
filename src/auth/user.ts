import { UserRoles } from './user-roles';

export class User {
  id: string;
  institute: string;
  roles: UserRoles[];
}

export function getUserPlainObject(user?: User): User {
  if (user) {
    return {
      id: user.id,
      institute: user.institute,
      roles: user.roles,
    };
  }
  return undefined;
}