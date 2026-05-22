import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { store } from '@/app';
import { registerAuthListeners } from '@/features/auth';

import Root from './Root.jsx';

import '@/styles/index.css';

registerAuthListeners();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Root />
    </Provider>
  </StrictMode>,
);
