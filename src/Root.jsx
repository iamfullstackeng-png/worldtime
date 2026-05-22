import { BrowserRouter } from 'react-router-dom';

import { AppRoutes } from '@/routes';

export default function Root() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
