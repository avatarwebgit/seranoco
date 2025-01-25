import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  PersistQueryClientProvider,
  persistQueryClient,
} from '@tanstack/react-query-persist-client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { I18nextProvider } from 'react-i18next';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'; // Correct import
import { store, persistor } from './store/store'; // Adjust the path as necessary
import i18next from './utils/i18next';

import './index.css';
import App from './App'; // Adjust the path as necessary
import { PersistGate } from 'redux-persist/integration/react';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

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
              <I18nextProvider i18n={i18next}>
                <App />
              </I18nextProvider>
            </QueryClientProvider>
          </PersistQueryClientProvider>
        </BrowserRouter>
    </Provider>
  </GoogleOAuthProvider>,
);
