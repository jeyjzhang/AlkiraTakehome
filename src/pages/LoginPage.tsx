import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { ArrowRightIcon, MailIcon } from '../components/Icons';
import { FormField } from '../components/FormField';
import { PasswordInput } from '../components/PasswordInput';
import {
  loginSchema,
  type LoginFormValues,
} from '../validation/authSchemas';

const demoAccounts = [
  {
    label: 'Read-only account',
    email: 'viewer@alkira.test',
    password: 'Viewer123!',
  },
  {
    label: 'Read/write account',
    email: 'editor@alkira.test',
    password: 'Editor123!',
  },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [authError, setAuthError] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const submit = async (values: LoginFormValues) => {
    setAuthError('');
    const result = await login(values);
    if (result.success) {
      navigate('/verify');
    } else {
      setAuthError(result.message ?? 'Unable to sign in.');
    }
  };

  const fillDemoAccount = (email: string, password: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
    setAuthError('');
  };

  return (
    <div className="auth-card">
      <header className="auth-card__header">
        <p className="eyebrow eyebrow--blue">Welcome back</p>
        <h2>Sign in to your account</h2>
        <p>Access your Alkira network infrastructure securely.</p>
      </header>

      <form onSubmit={handleSubmit(submit)} noValidate>
        {authError && (
          <div className="form-alert" role="alert">
            <span>!</span>
            <p>{authError}</p>
          </div>
        )}

        <FormField id="email" label="Email address" error={errors.email?.message}>
          <div className="input-shell">
            <MailIcon className="input-shell__icon" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              {...register('email')}
            />
          </div>
        </FormField>

        <FormField id="password" label="Password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
        </FormField>

        <div className="form-options">
          <label className="checkbox">
            <input type="checkbox" />
            <span>Remember email</span>
          </label>
          <button className="text-button" type="button" onClick={() => alert('Password recovery is outside the scope of this demo.')}>
            Forgot password?
          </button>
        </div>

        <button className="button button--primary button--full" disabled={isSubmitting} type="submit">
          {isSubmitting ? <span className="spinner" aria-label="Signing in" /> : <>
            Continue securely <ArrowRightIcon />
          </>}
        </button>
      </form>

      <div className="demo-accounts">
        <div className="section-divider"><span>Demo accounts</span></div>
        <div className="demo-accounts__grid">
          {demoAccounts.map((account) => (
            <button
              type="button"
              className="demo-account"
              key={account.email}
              onClick={() => fillDemoAccount(account.email, account.password)}
            >
              <span>{account.label}</span>
              <small>{account.email}</small>
            </button>
          ))}
        </div>
      </div>

      <p className="auth-card__footer">
        New to Alkira? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
}
