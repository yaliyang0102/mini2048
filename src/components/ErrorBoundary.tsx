'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        
          {'出现错误'} {/* ✅ 用引号和花括号正确包围中文字符串 */}
          {'钱包连接或游戏出现问题，请刷新页面重试'} {/* ✅ 同样修复 */}
           this.setState({ hasError: false })}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              background: 'white',
              color: '#ff4444',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {'重试'} {/* ✅ 修复按钮文本 */}
          
        
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
