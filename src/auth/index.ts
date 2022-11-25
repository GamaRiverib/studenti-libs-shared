import { User } from "./user";
import { UserRoles } from "./user-roles";

export * from "./roles.decorator";
export * from "./roles.guard";
export * from "./user-roles";
export * from "./user.decorator";
export * from "./user";

export const ROLES_USER_KEY = "roles";
export const USER_REQ_KEY = "user";
export const DEFAULT_AUTHORIZATION_HEADER = "authorization";
export const API_GATEWAY_AUTHORIZATION_HEADER = "x-apigateway-api-userinfo";

const PLATFORM_USER_ROLES: UserRoles[] = [
  UserRoles.SUPER_ADMIN,
  UserRoles.PLATFORM_ADMIN,
  UserRoles.CONFIGURATOR
];

const INSTITUTE_USER_ROLES: UserRoles[] = [
  UserRoles.ASSISTANT,
  UserRoles.INSTITUTE_ADMIN,
  UserRoles.INSTITUTE_EMPLOYEE,
  UserRoles.TEACHER
];

const INSTITUTE_CLIENT_USER_ROLES: UserRoles[] = [
  UserRoles.AUTHORIZED_PERSON,
  UserRoles.STUDENT,
  UserRoles.TUTOR
];

export function isPlataformAdmin(user: User): boolean {
  return (
    user.roles.includes(UserRoles.SUPER_ADMIN) ||
    user.roles.includes(UserRoles.PLATFORM_ADMIN)
  );
}

export function isInstituteConfigurator(user: User): boolean {
  return (
    user.roles.includes(UserRoles.INSTITUTE_ADMIN) ||
    user.roles.includes(UserRoles.CONFIGURATOR)
  );
}

export function isInstituteUser(user: User): boolean {
  return (
    user.roles.includes(UserRoles.ASSISTANT) ||
    user.roles.includes(UserRoles.INSTITUTE_ADMIN) ||
    user.roles.includes(UserRoles.INSTITUTE_EMPLOYEE) ||
    user.roles.includes(UserRoles.TEACHER)
  );
}

export function isPlataformUserRole(role: UserRoles): boolean {
  return PLATFORM_USER_ROLES.includes(role);
}

export function isInstituteUserRole(role: UserRoles): boolean {
  return INSTITUTE_USER_ROLES.includes(role);
}

export function isInstituteClientUserRole(role: UserRoles): boolean {
  return INSTITUTE_CLIENT_USER_ROLES.includes(role);
}
