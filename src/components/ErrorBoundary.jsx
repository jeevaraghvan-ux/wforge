import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("W Forge Error Caught by Boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="liquid-glass p-8 rounded-3xl max-w-lg w-full border border-rose-500/30 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold font-display text-white">Something went wrong</h2>
            <p className="text-xs text-slate-300">
              The application encountered an unexpected error. Click below to reload the workspace smoothly.
            </p>
            {this.state.error && (
              <div className="text-left font-mono text-[11px] p-3 rounded-xl bg-slate-900/80 text-rose-300 overflow-x-auto max-h-36 border border-rose-500/20">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="px-6 py-2.5 rounded-xl glass-btn-primary text-white text-xs font-bold inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload W Forge</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
