import { Component, type PropsWithChildren, type ReactNode } from 'react';
import { cx } from '../lib/utils';

interface ContentErrorBoundaryState {
  hasError: boolean;
}

export class ContentErrorBoundary extends Component<PropsWithChildren, ContentErrorBoundaryState> {
  state: ContentErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ContentErrorBoundaryState {
    return { hasError: true };
  }

  private reset = () => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <section
          aria-labelledby="content-error-title"
          className={cx('mx-auto max-w-3xl py-12')}
          role="alert"
        >
          <h2 id="content-error-title" className={cx('text-title2 text-text-primary')}>
            화면을 표시하지 못했습니다.
          </h2>
          <p className={cx('mt-3 text-body2 text-text-secondary')}>
            다시 시도하거나 상단 메뉴에서 다른 화면으로 이동해 주세요.
          </p>
          <button
            type="button"
            onClick={this.reset}
            className={cx(
              'mt-6 rounded-md bg-palette-primary px-5 py-3 text-body2 font-bold text-palette-white'
            )}
          >
            다시 시도
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}
