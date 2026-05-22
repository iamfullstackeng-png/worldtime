import { Route, Routes } from 'react-router-dom';

import { HomePage, LoginPage, NotFoundPage } from '@/pages';

import { PATHS } from './paths.js';
import ProtectedRoute from './ProtectedRoute.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={PATHS.LOGIN} element={<LoginPage />} />
      <Route
        path={PATHS.HOME}
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path={PATHS.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
}
