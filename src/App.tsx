import { Navigate, Route, Routes } from 'react-router';
import { AppShell } from './components/layout/AppShell';
import { Page as FavoritesPage } from './pages/favorites/Page';
import { Page as SearchPage } from './pages/search/Page';

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<SearchPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
