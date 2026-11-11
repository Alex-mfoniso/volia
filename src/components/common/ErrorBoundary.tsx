import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('VOLIA Uncaught Application Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6 bg-canvas">
          <div className="max-w-md w-full bg-white border border-border p-8 text-center shadow-sm">
            <div className="w-12 h-12 bg-status-danger-bg text-status-danger flex items-center justify-center mx-auto mb-4 border border-status-danger-border">
              <AlertTriangle className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h2 className="text-xl font-serif font-medium text-ink mb-2">
              System Boundary Interruption
            </h2>
            <p className="text-xs text-ink-muted leading-relaxed font-sans mb-6">
              An unexpected client runtime exception occurred during component render.
              The application state has been safely contained.
            </p>
            {this.state.error && (
              <pre className="text-[11px] bg-canvas-surface p-3 mb-6 text-left font-mono text-ink-muted overflow-x-auto border border-border/80">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex justify-center gap-3">
              <Button variant="primary" size="sm" onClick={this.handleReset}>
                <RotateCcw className="w-3.5 h-3.5 mr-2" />
                Reload Application
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
