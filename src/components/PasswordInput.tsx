import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { EyeIcon, LockIcon } from './Icons';

export const PasswordInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="input-shell">
      <LockIcon className="input-shell__icon" />
      <input ref={ref} type={visible ? 'text' : 'password'} {...props} />
      <button
        className="input-shell__action"
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
      >
        <EyeIcon off={visible} />
      </button>
    </div>
  );
});
