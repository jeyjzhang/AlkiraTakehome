import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CheckIcon, MailIcon } from '../components/Icons';
import { FormField } from '../components/FormField';
import { PasswordInput } from '../components/PasswordInput';
import { signupSchema, type SignupFormValues } from '../validation/authSchemas';

export function SignupPage() {
  const [submittedEmail, setSubmittedEmail] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  if (submittedEmail) {
    return (
      <div className="auth-card auth-card--success">
        <div className="success-icon"><CheckIcon /></div>
        <header className="auth-card__header auth-card__header--centered">
          <p className="eyebrow eyebrow--blue">Request received</p>
          <h2>You're on the list</h2>
          <p>
            In a production application, we would send an account activation link to{' '}
            <strong>{submittedEmail}</strong>.
          </p>
        </header>
        <Link className="button button--primary button--full" to="/login">
          Return to sign in <ArrowRightIcon />
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-card auth-card--signup">
      <header className="auth-card__header">
        <p className="eyebrow eyebrow--blue">Get started</p>
        <h2>Create your account</h2>
        <p>Request access to your organization's Alkira network.</p>
      </header>
      <form
        onSubmit={handleSubmit(async (values) => {
          await new Promise((resolve) => window.setTimeout(resolve, 350));
          setSubmittedEmail(values.email);
        })}
        noValidate
      >
        <FormField id="name" label="Full name" error={errors.name?.message}>
          <input
            id="name"
            placeholder="Your full name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            {...register('name')}
          />
        </FormField>
        <FormField id="signup-email" label="Work email" error={errors.email?.message}>
          <div className="input-shell">
            <MailIcon className="input-shell__icon" />
            <input
              id="signup-email"
              type="email"
              placeholder="name@company.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'signup-email-error' : undefined}
              {...register('email')}
            />
          </div>
        </FormField>
        <FormField id="signup-password" label="Password" error={errors.password?.message}>
          <PasswordInput
            id="signup-password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'signup-password-error' : undefined}
            {...register('password')}
          />
        </FormField>
        <FormField id="confirm-password" label="Confirm password" error={errors.confirmPassword?.message}>
          <PasswordInput
            id="confirm-password"
            placeholder="Repeat your password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
            {...register('confirmPassword')}
          />
        </FormField>
        <button className="button button--primary button--full" disabled={isSubmitting} type="submit">
          {isSubmitting ? <span className="spinner" aria-label="Creating account" /> : <>
            Create account <ArrowRightIcon />
          </>}
        </button>
      </form>
      <p className="auth-card__footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
