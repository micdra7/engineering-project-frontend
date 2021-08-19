import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'resources/theme';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { LandingPage } from 'components/Layout';
import ErrorBoundary from 'components/ErrorBoundary';

const queryClient = new QueryClient();

const GlobalRoutes = () => (
  <Switch>
    <Route exact path="/">
      <LandingPage />
    </Route>
  </Switch>
);

export const App = (): JSX.Element => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={theme}>
      <ErrorBoundary>
        <BrowserRouter>
          <GlobalRoutes />
        </BrowserRouter>
      </ErrorBoundary>
    </ChakraProvider>
  </QueryClientProvider>
);
