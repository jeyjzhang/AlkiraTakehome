import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const defaults = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export const MailIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const LockIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

export const EyeIcon = ({ off = false, ...props }: IconProps & { off?: boolean }) => (
  <svg {...defaults} {...props}>
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="2.5" />
    {off && <path d="m4 4 16 16" />}
  </svg>
);

export const ShieldIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M12 3 5 6v5c0 4.6 2.8 8.5 7 10 4.2-1.5 7-5.4 7-10V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const ArrowRightIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M5 12h14M14 7l5 5-5 5" />
  </svg>
);

export const ArrowLeftIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M19 12H5m5 5-5-5 5-5" />
  </svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="m5 12 4 4L19 6" />
  </svg>
);

export const PencilIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
  </svg>
);

export const LogoutIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M10 17l5-5-5-5M15 12H3" />
    <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
  </svg>
);

export const NetworkIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <circle cx="12" cy="5" r="2" />
    <circle cx="5" cy="19" r="2" />
    <circle cx="19" cy="19" r="2" />
    <path d="M12 7v5M5 17v-3h14v3" />
  </svg>
);

export const ActivityIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M3 12h4l2.5-7 5 14 2.5-7h4" />
  </svg>
);

export const UsersIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const InfoIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </svg>
);

export const CloseIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);
