import  { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RouterErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Router error:', error, errorInfo);
  }

  private handleHome = () => {
    window.location.href = '/';
    this.setState({ hasError: false, error: null });
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Navigation Error
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {this.state.error?.message || 'Failed to load the requested page'}
              </p>
            </div>
            <div className="mt-8 space-y-4">
              <Button
                onClick={this.handleHome}
                className="w-full"
                variant="default"
              >
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Button>
              <Button
                onClick={this.handleRetry}
                className="w-full"
                variant="outline"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouterErrorBoundary; 