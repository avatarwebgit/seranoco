import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  PersistQueryClientProvider,
  persistQueryClient,
} from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'; // Correct import
import App from './App'; // Adjust the path as necessary
import store from './store/store'; // Adjust the path as necessary

import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Create a new Query Client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
      cacheTime: 1000 * 60 * 10, // Cache data for 10 minutes after component unmounts
    },
  },
});

// Create a persister using localStorage
const persister = createSyncStoragePersister({
  storage: window.localStorage, // Using localStorage to persist data
});

// Persist the query client
persistQueryClient({
  queryClient,
  persister,
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <BrowserRouter>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister }}
        >
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </PersistQueryClientProvider>
      </BrowserRouter>
    </Provider>
  </GoogleOAuthProvider>,
);
