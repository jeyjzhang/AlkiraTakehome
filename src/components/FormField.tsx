import type { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({
  id,
  label,
  error,
  hint,
  children,
}: FormFieldProps) {
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={`form-field${error ? ' form-field--error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? (
        <p className="field-message field-message--error" id={descriptionId} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="field-message" id={descriptionId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
