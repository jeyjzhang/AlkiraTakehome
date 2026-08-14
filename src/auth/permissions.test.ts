import { hasPermission } from './permissions';

describe('role permissions', () => {
  it('allows both roles to read resources', () => {
    expect(hasPermission('read-only', 'resource:read')).toBe(true);
    expect(hasPermission('read-write', 'resource:read')).toBe(true);
  });

  it('allows only the read/write role to edit resources', () => {
    expect(hasPermission('read-only', 'resource:edit')).toBe(false);
    expect(hasPermission('read-write', 'resource:edit')).toBe(true);
  });
});
