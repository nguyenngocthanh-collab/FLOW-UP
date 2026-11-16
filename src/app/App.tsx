import { appName } from '../lib/environment';

export function App() {
  return (
    <main className="app-shell">
      <p className="app-shell__eyebrow">Project foundation</p>
      <h1>{appName}</h1>
      <p className="app-shell__description">
        The application foundation is ready. Product features will be added
        only when their Blueprint specifications and dependencies are ready.
      </p>
    </main>
  );
}
