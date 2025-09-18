import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { HeroUIProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import routes from '../routes';

export async function renderWithProviders() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const testRouter = createMemoryRouter(routes);

  const AllProviders = () => {
    return (
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <HeroUIProvider>
            <RouterProvider router={testRouter} />
          </HeroUIProvider>
        </QueryClientProvider>
      </HelmetProvider>
    );
  };

  return render(<AllProviders />);
}
