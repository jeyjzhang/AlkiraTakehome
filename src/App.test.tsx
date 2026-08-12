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
});
