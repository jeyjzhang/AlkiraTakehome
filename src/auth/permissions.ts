import type { UserRole } from './types';

export type Permission = 'resource:read' | 'resource:edit';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  'read-only': ['resource:read'],
  'read-write': ['resource:read', 'resource:edit'],
};

export function hasPermission(role: UserRole, permission: Permission) {
  return ROLE_PERMISSIONS[role].includes(permission);
}
