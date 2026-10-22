import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RootProvider } from './providers/RootProvider';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('앱 루트 요소를 찾을 수 없습니다.');
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <RootProvider>
      <App />
    </RootProvider>
  </StrictMode>
);
