import { Component } from "react";
import { Result, Button } from "antd";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="编辑器加载失败"
          subTitle={this.state.error?.message || "请刷新页面重试"}
          extra={
            <Button type="primary" onClick={this.handleRetry}>
              重试
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;