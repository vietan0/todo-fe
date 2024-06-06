import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, test } from 'vitest';

import routes from './routes';

async function renderWithProviders() {
  const queryClient = new QueryClient();
  const testRouter = createMemoryRouter(routes);

  const AllProviders = () => (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider>
          <RouterProvider router={testRouter} />
        </NextUIProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );

  return render(<AllProviders />);
}

function SimpleComp() {
  return <span>SimpleComp</span>;
}

afterEach(() => {
  cleanup();
});

test('first test', async () => {
  render(<SimpleComp />);
  screen.debug();
});
