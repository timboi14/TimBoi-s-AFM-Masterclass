import { Component, type ErrorInfo, type ReactNode } from 'react';

interface State { error: Error | null }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to console for debugging in browser dev tools
    console.error('TBA crash:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          padding: 32,
          color: '#f0f4ff',
          background: '#0a0f1e',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <div style={{ maxWidth: 720, margin: '40px auto' }}>
            <h1 style={{ color: '#ef4444', fontSize: 32, marginBottom: 8 }}>Something went wrong.</h1>
            <p style={{ opacity: 0.8, marginBottom: 16 }}>
              The Academy hit an error rendering this page. The fastest fix is usually:
            </p>
            <ol style={{ opacity: 0.8, lineHeight: 1.8, paddingLeft: 20 }}>
              <li>Hard refresh: <b>Ctrl+Shift+R</b> (Windows) or <b>Cmd+Shift+R</b> (Mac)</li>
              <li>Open the browser dev console (F12) and copy the error</li>
              <li>If it persists, send the error message back so it can be patched</li>
            </ol>
            <details style={{
              marginTop: 24,
              padding: 16,
              background: '#1a2235',
              border: '1px solid #243049',
              borderRadius: 8,
              fontSize: 12,
              overflow: 'auto',
            }}>
              <summary style={{ cursor: 'pointer', color: '#ffd600' }}>Error details</summary>
              <pre style={{ margin: '12px 0 0', whiteSpace: 'pre-wrap' }}>
                {this.state.error.name}: {this.state.error.message}
                {'\n\n'}
                {this.state.error.stack}
              </pre>
            </details>
            <button
              onClick={() => { localStorage.clear(); location.reload(); }}
              style={{
                marginTop: 24,
                padding: '12px 20px',
                background: '#00c853',
                color: '#0a0f1e',
                border: 0,
                borderRadius: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Reset and reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
