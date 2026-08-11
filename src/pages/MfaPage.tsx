import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { ArrowLeftIcon, ArrowRightIcon, ShieldIcon } from '../components/Icons';
import { FormField } from '../components/FormField';
import { mfaSchema, type MfaFormValues } from '../validation/authSchemas';

export function MfaPage() {
  const navigate = useNavigate();
  const { pendingUser, verifyMfa, cancelMfa } = useAuth();
  const [authError, setAuthError] = useState('');
  const [resent, setResent] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MfaFormValues>({
    resolver: zodResolver(mfaSchema),
    defaultValues: { code: '' },
  });

  const submit = async ({ code }: MfaFormValues) => {
    setAuthError('');
    const result = await verifyMfa(code);
    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setAuthError(result.message ?? 'Unable to verify the code.');
    }
  };

  const returnToLogin = () => {
    cancelMfa();
    navigate('/login', { replace: true });
  };

  return (
    <div className="auth-card auth-card--mfa">
      <div className="security-icon"><ShieldIcon /></div>
      <header className="auth-card__header auth-card__header--centered">
        <p className="eyebrow eyebrow--blue">Identity verification</p>
        <h2>Check your email</h2>
        <p>
          We sent a 6-digit verification code to<br />
          <strong>{pendingUser?.email}</strong>
        </p>
      </header>

      <form onSubmit={handleSubmit(submit)} noValidate>
        {authError && (
          <div className="form-alert" role="alert"><span>!</span><p>{authError}</p></div>
        )}
        <FormField
          id="code"
          label="Verification code"
          error={errors.code?.message}
          hint="For this demo, use 123456"
        >
          <input
            className="otp-input"
            id="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            aria-invalid={Boolean(errors.code)}
            aria-describedby={errors.code ? 'code-error' : 'code-hint'}
            {...register('code', {
              onChange: (event) => {
                event.target.value = event.target.value.replace(/\D/g, '');
              },
            })}
          />
        </FormField>

        <button className="button button--primary button--full" disabled={isSubmitting} type="submit">
          {isSubmitting ? <span className="spinner" aria-label="Verifying code" /> : <>
            Verify and continue <ArrowRightIcon />
          </>}
        </button>
      </form>

      <div className="mfa-actions">
        <p>Didn't receive a code?</p>
        <button
          className="text-button"
          type="button"
          disabled={resent}
          onClick={() => {
            setValue('code', '');
            setResent(true);
          }}
        >
          {resent ? 'A new code was sent' : 'Resend code'}
        </button>
      </div>

      <button className="back-link" type="button" onClick={returnToLogin}>
        <ArrowLeftIcon /> Back to sign in
      </button>
    </div>
  );
}
