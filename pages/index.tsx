import { useState, useEffect } from 'react';
import Head from 'next/head';

const GITHUB_REPO_URL = 'https://github.com/your-username/oscars-hub';

interface DemoAction {
  label: string;
  endpoint: string;
}

const demoActions: DemoAction[] = [
  { label: 'List years (/api/years)', endpoint: '/api/years' },
  { label: '2024 Ceremony (/api/year/2024)', endpoint: '/api/year/2024' },
  { label: '2023 Ceremony (/api/year/2023)', endpoint: '/api/year/2023' },
  { label: '2022 Ceremony (/api/year/2022)', endpoint: '/api/year/2022' },
  { label: '2021 Ceremony (/api/year/2021)', endpoint: '/api/year/2021' },
  { label: '2020 Ceremony (/api/year/2020)', endpoint: '/api/year/2020' },
  { label: 'Movie: Oppenheimer', endpoint: '/api/movie/Oppenheimer' },
  { label: 'Movie: Poor Things', endpoint: '/api/movie/Poor%20Things' },
  { label: 'Movie: Everything Everywhere All at Once', endpoint: '/api/movie/Everything%20Everywhere%20All%20at%20Once' },
  { label: 'Movie: CODA', endpoint: '/api/movie/CODA' },
  { label: 'Movie: Nomadland', endpoint: '/api/movie/Nomadland' },
  { label: 'Movie: Parasite', endpoint: '/api/movie/Parasite' },
  { label: 'Search: Nolan', endpoint: '/api/search?q=Nolan' },
  { label: 'Search: Emma Stone', endpoint: '/api/search?q=Emma%20Stone' },
  { label: 'Search: Best Picture', endpoint: '/api/search?q=Best%20Picture' },
  { label: 'Health (/api/health)', endpoint: '/api/health' },
];

export default function Home() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>(demoActions[0].endpoint);
  const [customEndpoint, setCustomEndpoint] = useState<string>(demoActions[0].endpoint);
  const [response, setResponse] = useState<unknown>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    run(selectedEndpoint);
  }, []);

  const run = async (url: string) => {
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `status ${res.status}`);
      setResponse(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (endpoint: string) => {
    setSelectedEndpoint(endpoint);
    setCustomEndpoint(endpoint);
    run(endpoint);
  };

  const handleRun = () => {
    setSelectedEndpoint(customEndpoint);
    run(customEndpoint);
  };

  return (
    <>
      <Head>
        <title>OscarsHub API Playground</title>
        <meta
          name="description"
          content="Free, open-source REST API serving Academy Awards winners (2020–2024)."
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <main style={{ fontFamily: 'sans-serif', padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>OscarsHub API Playground</h1>
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '0.4rem 0.8rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            textDecoration: 'none',
            color: '#111',
            fontSize: '0.9rem',
          }}
        >
          View on GitHub ↗
        </a>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
        <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex' }}>
          <img
            src="https://img.shields.io/badge/GitHub-oscars--hub-181717?style=flat&logo=github"
            alt="GitHub Repo"
            style={{ height: '20px', display: 'block' }}
          />
        </a>
        <img
          src="https://img.shields.io/badge/Rate%20Limit-60%20req%2Fmin-orange?style=flat"
          alt="Rate Limit: 60 req/min"
          style={{ height: '20px', display: 'block' }}
        />
        <img
          src="https://img.shields.io/badge/License-MIT-blue?style=flat"
          alt="License: MIT"
          style={{ height: '20px', display: 'block' }}
        />
      </div>
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            aria-label="Select endpoint"
            value={demoActions.some((a) => a.endpoint === customEndpoint) ? customEndpoint : ''}
            onChange={(e) => {
              if (e.target.value) handleSelect(e.target.value);
            }}
            style={{ padding: '0.4rem' }}
          >
            <option value="" disabled>
              Select…
            </option>
            {demoActions.map((action) => (
              <option key={action.endpoint} value={action.endpoint}>
                {action.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={customEndpoint}
            onChange={(e) => setCustomEndpoint(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRun();
            }}
            style={{ flex: 1, minWidth: '250px', padding: '0.4rem' }}
          />
          <button onClick={handleRun} style={{ padding: '0.4rem 0.8rem' }}>
            Run
          </button>
        </div>

        <div>
          <strong>Request:</strong> <code>{selectedEndpoint}</code>
        </div>

        {loading && <p>Loading…</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {response !== null && (
          <pre
            style={{
              background: '#f4f4f4',
              padding: '1rem',
              overflowX: 'auto',
              maxHeight: '70vh',
            }}
          >
            {JSON.stringify(response, null, 2)}
          </pre>
        )}
      </section>

      <section
        style={{
          marginTop: '2.5rem',
          borderTop: '1px solid #e5e5e5',
          paddingTop: '1.5rem',
          lineHeight: 1.6,
          maxWidth: '820px',
          color: '#222',
        }}
      >
        <h2>Documentation</h2>
        <p>
          <strong>OscarsHub API</strong> is a free, open-source REST API serving Academy Awards
          winners from <strong>2020 to 2024</strong>. It provides ceremony summaries, winning
          films, directors, writers, actors, and categories as JSON—no authentication or API key
          required.
        </p>

        <h3>Base URL</h3>
        <p>
          All endpoints are served under <code>/api</code> (e.g.,{' '}
          <code>https://your-domain.vercel.app/api/years</code>).
        </p>

        <h3>Available Endpoints</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '0.5rem' }}>Method</th>
              <th style={{ padding: '0.5rem' }}>Path</th>
              <th style={{ padding: '0.5rem' }}>Parameters</th>
              <th style={{ padding: '0.5rem' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}><code>GET</code></td>
              <td style={{ padding: '0.5rem' }}><code>/api/years</code></td>
              <td style={{ padding: '0.5rem' }}>—</td>
              <td style={{ padding: '0.5rem' }}>Returns a JSON array of all available ceremony years.</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}><code>GET</code></td>
              <td style={{ padding: '0.5rem' }}><code>/api/year/:year</code></td>
              <td style={{ padding: '0.5rem' }}><code>year</code> (path, e.g. <code>2024</code>)</td>
              <td style={{ padding: '0.5rem' }}>Returns the ceremony date and all winning categories for that year.</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}><code>GET</code></td>
              <td style={{ padding: '0.5rem' }}><code>/api/movie/:title</code></td>
              <td style={{ padding: '0.5rem' }}><code>title</code> (path, case-insensitive)</td>
              <td style={{ padding: '0.5rem' }}>Returns film details (when available) and all Oscar wins matching the title.</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}><code>GET</code></td>
              <td style={{ padding: '0.5rem' }}><code>/api/search</code></td>
              <td style={{ padding: '0.5rem' }}><code>q</code> (query, required)</td>
              <td style={{ padding: '0.5rem' }}>Case-insensitive search across film titles, people, and categories.</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}><code>GET</code></td>
              <td style={{ padding: '0.5rem' }}><code>/api/health</code></td>
              <td style={{ padding: '0.5rem' }}>—</td>
              <td style={{ padding: '0.5rem' }}>Health check returning service status and UTC timestamp.</td>
            </tr>
          </tbody>
        </table>

        <h3>Usage Examples</h3>
        <pre
          style={{
            background: '#f4f4f4',
            padding: '1rem',
            overflowX: 'auto',
            borderRadius: '4px',
          }}
        >
{`// JavaScript (fetch)
const res = await fetch('/api/movie/Oppenheimer');
const movie = await res.json();

// Search by person, film, or category
const searchRes = await fetch('/api/search?q=Nolan');
const results = await searchRes.json();

# cURL
curl https://your-domain.vercel.app/api/year/2024`}
        </pre>

        <h3>Status Codes</h3>
        <ul>
          <li><code>200 OK</code> — Request succeeded and JSON payload is returned.</li>
          <li><code>400 Bad Request</code> — Missing required parameter (e.g., <code>q</code> on <code>/api/search</code>).</li>
          <li><code>404 Not Found</code> — Requested year or movie was not found.</li>
          <li><code>429 Too Many Requests</code> — Rate limit exceeded (includes <code>Retry-After</code> header).</li>
        </ul>

        <h3>Rate Limiting, Caching &amp; License</h3>
        <ul>
          <li><strong>Rate limit:</strong> 60 requests per minute per IP address across <code>/api/*</code>.</li>
          <li><strong>Caching:</strong> data endpoints return <code>Cache-Control: public, max-age=86400</code> (24 hours).</li>
          <li><strong>Authentication:</strong> none required; all endpoints are public and read-only.</li>
          <li><strong>License:</strong> open source under the MIT License.</li>
        </ul>
      </section>
    </main>
    </>
  );
}
