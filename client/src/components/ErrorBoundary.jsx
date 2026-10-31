import React from 'react';
import { RotateCcw, Home, AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Match Render Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  handleHome = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onHome) {
      this.props.onHome();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative w-full h-full min-h-screen bg-[#080d1a] flex flex-col items-center justify-center p-6 text-white text-center select-none">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-2xl font-black tracking-wider text-slate-100 mb-2">
            MATCH DISPLAY GLITCH
          </h2>
          <p className="text-slate-400 max-w-md text-sm mb-6">
            The match scene encountered a temporary display glitch. Tap Retry to restart the match, Reload to refresh, or return to the main menu.
          </p>
          {this.state.error && (
            <div className="bg-black/40 border border-slate-800 rounded-lg p-3 max-w-md text-xs font-mono text-rose-400 mb-6 break-all">
              {this.state.error.message || String(this.state.error)}
            </div>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Retry Match
            </button>
            <button
              onClick={this.handleReload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 font-bold text-sm border border-amber-500/50 active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </button>
            <button
              onClick={this.handleHome}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 active:scale-95 transition-all"
            >
              <Home className="w-4 h-4" />
              Main Menu
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
