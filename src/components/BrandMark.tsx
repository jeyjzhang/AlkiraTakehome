export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand" aria-label="Alkira">
      <svg
        className="brand__mark"
        viewBox="0 0 40 40"
        aria-hidden="true"
      >
        <path d="M20 3 37 32H3L20 3Z" fill="currentColor" opacity=".28" />
        <path d="M20 9 31.7 29H8.3L20 9Z" fill="currentColor" />
        <path d="m20 17 5.2 9h-10.4l5.2-9Z" fill="#081a2c" />
      </svg>
      {!compact && <span className="brand__wordmark">alkira</span>}
    </div>
  );
}
