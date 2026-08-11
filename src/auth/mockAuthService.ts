import type { AuthenticatedUser, LoginCredentials } from './types';

interface MockUserRecord extends AuthenticatedUser {
  password: string;
}

const MOCK_USERS: MockUserRecord[] = [
  {
    id: 'usr_viewer_01',
    name: 'Alex Viewer',
    email: 'viewer@alkira.test',
    password: 'Viewer123!',
    role: 'read-only',
  },
  {
    id: 'usr_editor_01',
    name: 'Sam Editor',
    email: 'editor@alkira.test',
    password: 'Editor123!',
    role: 'read-write',
  },
];

export const MOCK_MFA_CODE = '123456';

const delay = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const toSafeUser = (user: MockUserRecord): AuthenticatedUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export async function authenticateWithPassword(
  credentials: LoginCredentials,
): Promise<AuthenticatedUser | null> {
  await delay(450);

  const user = MOCK_USERS.find(
    (candidate) =>
      candidate.email.toLowerCase() === credentials.email.trim().toLowerCase() &&
      candidate.password === credentials.password,
  );

  return user ? toSafeUser(user) : null;
}

export async function verifyMfaCode(code: string): Promise<boolean> {
  await delay(350);
  return code === MOCK_MFA_CODE;
}
