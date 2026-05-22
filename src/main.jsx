import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { store } from '@/app';
import { registerAuthListeners } from '@/features/auth';

import Root from './Root.jsx';

import '@/styles/index.css';

// Force the auth-listener module's side-effect registrations to run; bundlers
// would otherwise be free to tree-shake a side-effect-only import.
registerAuthListeners();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Root />
    </Provider>
  </StrictMode>,
);
