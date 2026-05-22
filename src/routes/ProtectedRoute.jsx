import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/features/auth/index.js';

import { PATHS } from './paths.js';

/**
 * Route guard. Renders children when the user is authenticated; otherwise
 * redirects to /login.
 *
 * - `replace` keeps the bounce out of browser history.
 * - `state.from` records the requested location so Login can deep-link back
 *   on success (latent capability; the brief only has two routes).
 * - Guard is component-based rather than route-config metadata — clearer
 *   for two routes than a metadata reader would be.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={PATHS.LOGIN} replace state={{ from: location }} />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
