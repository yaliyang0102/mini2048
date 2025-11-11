// src/components/ErrorBoundary.tsx
"use client";
import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", padding: 24 }}>
          <div className="card" style={{ textAlign: "center" }}>
            <h2 className="h1" style={{ marginTop: 0 }}>出现错误</h2>
            <p className="mono">钱包连接或游戏出现问题，请刷新页面重试</p>
            <button
              className="btn"
              onClick={() => this.setState({ hasError: false })}
              style={{ marginTop: 12 }}
            >
              重试
            </button>
          </div>
        </div>
      );
    }
    // ✅ 这里一定要返回 this.props.children，不能写成 { children } 或者包在对象里
    return this.props.children;
  }
}
