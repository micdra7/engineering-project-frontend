import React from 'react';

const toError = (error, componentStack) =>
  `${error.toString()}\n\nThis is located at:${componentStack}`;

class ErrorBoundary extends React.Component {
  constructor() {
    super();

    this.state = {
      error: null,
      info: null,
      hasError: false,
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  componentDidCatch(error, info) {
    this.setState({ info });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  render() {
    // eslint-disable-next-line react/prop-types
    const { children } = this.props;
    const { hasError, info, error } = this.state;
    const title = info ? info.componentStack : '';

    if (hasError) {
      return <p>something went wrong {toError(error, title)}</p>;
    }

    return children;
  }
}

export default ErrorBoundary;
