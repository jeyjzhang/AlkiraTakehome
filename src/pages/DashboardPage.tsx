import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { hasPermission } from '../auth/permissions';
import { BrandMark } from '../components/BrandMark';
import {
  ActivityIcon,
  CheckIcon,
  CloseIcon,
  InfoIcon,
  LogoutIcon,
  NetworkIcon,
  PencilIcon,
  ShieldIcon,
  UsersIcon,
} from '../components/Icons';

interface NetworkResource {
  id: number;
  name: string;
  provider: 'AWS' | 'Azure' | 'GCP';
  region: string;
  status: 'Connected' | 'Degraded';
  cidr: string;
}

const initialResources: NetworkResource[] = [
  { id: 1, name: 'Production Core', provider: 'AWS', region: 'us-east-1', status: 'Connected', cidr: '10.20.0.0/16' },
  { id: 2, name: 'Analytics Hub', provider: 'GCP', region: 'us-central1', status: 'Connected', cidr: '10.40.0.0/16' },
  { id: 3, name: 'Customer Services', provider: 'Azure', region: 'East US 2', status: 'Degraded', cidr: '10.60.0.0/16' },
  { id: 4, name: 'Development', provider: 'AWS', region: 'ca-central-1', status: 'Connected', cidr: '10.80.0.0/16' },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [resources, setResources] = useState(initialResources);
  const [editing, setEditing] = useState<NetworkResource | null>(null);
  const [resourceName, setResourceName] = useState('');
  const [toast, setToast] = useState('');

  const canEdit = user ? hasPermission(user.role, 'resource:edit') : false;
  const initials = useMemo(
    () => user?.name.split(' ').map((part) => part[0]).join('').slice(0, 2),
    [user?.name],
  );

  const openEditor = (resource: NetworkResource) => {
    if (!canEdit) return;
    setResourceName(resource.name);
    setEditing(resource);
  };

  const saveResource = () => {
    if (!canEdit || !editing || !resourceName.trim()) return;
    setResources((current) =>
      current.map((resource) =>
        resource.id === editing.id
          ? { ...resource, name: resourceName.trim() }
          : resource,
      ),
    );
    setEditing(null);
    setToast('Network resource updated successfully.');
    window.setTimeout(() => setToast(''), 3000);
  };

  const signOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand"><BrandMark /></div>
        <nav aria-label="Primary navigation">
          <a className="nav-item nav-item--active" href="#overview"><NetworkIcon /> Overview</a>
          <a className="nav-item" href="#resources"><ActivityIcon /> Networks</a>
          <a className="nav-item" href="#team"><UsersIcon /> Team access</a>
        </nav>
        <div className="sidebar__security">
          <ShieldIcon />
          <div><strong>Secure session</strong><span>MFA verified</span></div>
        </div>
      </aside>

      <main className="dashboard">
        <header className="topbar">
          <div className="topbar__mobile-brand"><BrandMark compact /></div>
          <div className="topbar__user">
            <div className="avatar" aria-hidden="true">{initials}</div>
            <div className="topbar__identity">
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
            <span className={`role-badge role-badge--${user?.role}`}>
              {user?.role === 'read-write' ? 'Read / write' : 'Read only'}
            </span>
            <button className="icon-button" type="button" onClick={signOut} aria-label="Sign out" title="Sign out">
              <LogoutIcon />
            </button>
          </div>
        </header>

        <div className="dashboard__content" id="overview">
          <header className="page-heading">
            <div>
              <p className="eyebrow eyebrow--blue">Network control center</p>
              <h1>Good afternoon, {user?.name.split(' ')[0]}</h1>
              <p>Here's the current state of your cloud network infrastructure.</p>
            </div>
            <div className="verified-chip"><ShieldIcon /> Identity verified</div>
          </header>

          {!canEdit && (
            <div className="access-notice" role="status">
              <InfoIcon />
              <div>
                <strong>You're viewing in read-only mode</strong>
                <p>You can inspect network resources, but editing is restricted for your role.</p>
              </div>
            </div>
          )}

          <section className="metric-grid" aria-label="Network summary">
            <article className="metric-card">
              <div className="metric-card__icon metric-card__icon--blue"><NetworkIcon /></div>
              <div><span>Cloud networks</span><strong>4</strong><small>Across 3 providers</small></div>
            </article>
            <article className="metric-card">
              <div className="metric-card__icon metric-card__icon--green"><ActivityIcon /></div>
              <div><span>Active connections</span><strong>28</strong><small className="positive">↑ 8% this month</small></div>
            </article>
            <article className="metric-card">
              <div className="metric-card__icon metric-card__icon--purple"><UsersIcon /></div>
              <div><span>Team members</span><strong>12</strong><small>2 active now</small></div>
            </article>
          </section>

          <section className="resource-card" id="resources">
            <header className="resource-card__header">
              <div><h2>Cloud network resources</h2><p>Connected networks across your cloud providers.</p></div>
              <span className="resource-count">{resources.length} resources</span>
            </header>
            <div className="table-scroll">
              <table>
                <thead><tr><th>Name</th><th>Provider</th><th>Region</th><th>Network</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  {resources.map((resource) => (
                    <tr key={resource.id}>
                      <td><strong>{resource.name}</strong></td>
                      <td><span className={`provider provider--${resource.provider.toLowerCase()}`}>{resource.provider}</span></td>
                      <td>{resource.region}</td>
                      <td><code>{resource.cidr}</code></td>
                      <td><span className={`status status--${resource.status.toLowerCase()}`}><i />{resource.status}</span></td>
                      <td>
                        <button
                          className="edit-button"
                          type="button"
                          disabled={!canEdit}
                          onClick={() => openEditor(resource)}
                          aria-label={`Edit ${resource.name}`}
                          title={canEdit ? `Edit ${resource.name}` : 'Read-only role cannot edit resources'}
                        >
                          <PencilIcon /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <footer className="resource-card__footer">
              {canEdit ? <><CheckIcon /> Your role permits resource editing.</> : <><ShieldIcon /> Edit controls are disabled by your role.</>}
            </footer>
          </section>
        </div>
      </main>

      {editing && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setEditing(null)}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="edit-title">
            <header><div><p className="eyebrow eyebrow--blue">Resource settings</p><h2 id="edit-title">Edit network</h2></div><button className="icon-button" type="button" onClick={() => setEditing(null)} aria-label="Close"><CloseIcon /></button></header>
            <div className="modal__body">
              <label htmlFor="resource-name">Network name</label>
              <input id="resource-name" value={resourceName} onChange={(event) => setResourceName(event.target.value)} autoFocus />
              <div className="readonly-grid"><div><span>Provider</span><strong>{editing.provider}</strong></div><div><span>Network</span><strong>{editing.cidr}</strong></div></div>
              <p className="modal__note"><InfoIcon /> This demo permits renaming only. Provider and CIDR are immutable.</p>
            </div>
            <footer><button className="button button--secondary" type="button" onClick={() => setEditing(null)}>Cancel</button><button className="button button--primary" type="button" onClick={saveResource} disabled={!resourceName.trim()}>Save changes</button></footer>
          </section>
        </div>
      )}

      {toast && <div className="toast" role="status"><CheckIcon /> {toast}</div>}
    </div>
  );
}
