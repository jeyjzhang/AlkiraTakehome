import { Outlet } from 'react-router-dom';
import { BrandMark } from '../components/BrandMark';
import { CheckIcon } from '../components/Icons';

const highlights = [
  'Secure multi-factor authentication',
  'Role-based access controls',
  'Unified network visibility',
];

export function AuthLayout() {
  return (
    <main className="auth-layout">
      <section className="auth-hero" aria-label="Product introduction">
        <BrandMark />
        <div className="auth-hero__content">
          <p className="eyebrow">Secure cloud networking</p>
          <h1>One network.<br />Every cloud.</h1>
          <p className="auth-hero__lede">
            Connect users, sites, and clouds through one secure network built for
            modern infrastructure.
          </p>
          <ul className="feature-list">
            {highlights.map((highlight) => (
              <li key={highlight}>
                <span><CheckIcon /></span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
        <div className="network-art" aria-hidden="true">
          <span className="network-art__glow" />
          <span className="network-art__node network-art__node--one" />
          <span className="network-art__node network-art__node--two" />
          <span className="network-art__node network-art__node--three" />
        </div>
        <p className="auth-hero__footer">© 2026 Alkira, Inc.</p>
      </section>
      <section className="auth-panel">
        <div className="auth-panel__mobile-brand"><BrandMark /></div>
        <Outlet />
      </section>
    </main>
  );
}
