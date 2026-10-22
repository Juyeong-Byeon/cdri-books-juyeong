import { Navigate, Route, Routes } from 'react-router';
import { AppShell } from './components/layout/AppShell';
import { FavoritesPage } from './pages/FavoritesPage';
import { SearchPage } from './pages/SearchPage';

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
