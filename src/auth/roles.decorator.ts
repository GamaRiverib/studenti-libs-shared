import { SetMetadata } from '@nestjs/common';
import { UserRoles } from './user-roles';
import { ROLES_USER_KEY } from '.';

export const Roles = (...roles: UserRoles[]) =>
  SetMetadata(ROLES_USER_KEY, roles);
