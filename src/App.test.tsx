import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';
import { AuthProvider } from './auth/AuthContext';

function renderApp(route = '/login') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('authentication experience', () => {
  it('shows actionable validation messages on an empty login form', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: /continue securely/i }));

    expect(await screen.findByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
  });

  it('does not permit a protected route without completed authentication', () => {
    renderApp('/dashboard');

    expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /network control center/i })).not.toBeInTheDocument();
  });

  it('does not permit direct access to the MFA screen', () => {
    renderApp('/verify');

    expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /check your email/i })).not.toBeInTheDocument();
  });

  it('shows a generic error for invalid credentials', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByLabelText(/email address/i), 'viewer@alkira.test');
    await user.type(screen.getByLabelText(/^password$/i), 'WrongPassword1!');
    await user.click(screen.getByRole('button', { name: /continue securely/i }));

    expect(await screen.findByText(/email or password you entered is incorrect/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /check your email/i })).not.toBeInTheDocument();
  });

  it('requires valid MFA before granting read/write access', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: /read\/write account/i }));
    await user.click(screen.getByRole('button', { name: /continue securely/i }));

    expect(await screen.findByRole('heading', { name: /check your email/i })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/verification code/i), '654321');
    await user.click(screen.getByRole('button', { name: /verify and continue/i }));
    expect(await screen.findByText(/verification code is incorrect/i)).toBeInTheDocument();

    await user.clear(screen.getByLabelText(/verification code/i));
    await user.type(screen.getByLabelText(/verification code/i), '123456');
    await user.click(screen.getByRole('button', { name: /verify and continue/i }));

    expect(await screen.findByText('Read / write')).toBeInTheDocument();
    const editButton = screen.getByRole('button', { name: /edit production core/i });
    expect(editButton).toBeEnabled();

    await user.click(editButton);
    expect(screen.getByRole('dialog', { name: /edit network/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/network name/i)).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(editButton).toHaveFocus();
  });

  it('disables edit actions for a read-only user', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: /read-only account/i }));
    await user.click(screen.getByRole('button', { name: /continue securely/i }));
    await user.type(await screen.findByLabelText(/verification code/i), '123456');
    await user.click(screen.getByRole('button', { name: /verify and continue/i }));

    expect(await screen.findByText(/viewing in read-only mode/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit production core/i })).toBeDisabled();
  });

  it('restores a completed session and clears it on sign out', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem('alkira-auth-session', JSON.stringify({
      id: 'usr_editor_01',
      name: 'Sam Editor',
      email: 'editor@alkira.test',
      role: 'read-write',
    }));

    renderApp('/dashboard');

    expect(screen.getByText('Read / write')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /sign out/i }));

    expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument();
    expect(sessionStorage.getItem('alkira-auth-session')).toBeNull();
  });

  it('validates mismatched passwords during sign-up', async () => {
    const user = userEvent.setup();
    renderApp('/signup');

    await user.type(screen.getByLabelText(/full name/i), 'Jamie Zhang');
    await user.type(screen.getByLabelText(/work email/i), 'jamie@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password1');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password2');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /you're on the list/i })).not.toBeInTheDocument();
  });
});
