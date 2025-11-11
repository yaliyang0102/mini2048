"use client";
import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary] caught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: 560, margin: "40px auto", padding: 16 }}>
          <h2 style={{ margin: 0 }}>出现错误</h2>
          <p style={{ opacity: 0.8 }}>
            钱包连接或游戏出现问题，请刷新页面重试。
          </p>
          <button
            className="btn"
            onClick={() => this.setState({ hasError: false })}
          >
            重新加载
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
