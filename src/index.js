import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider, persistQueryClient } from '@tanstack/react-query-persist-client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { I18nextProvider } from 'react-i18next';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { store, persistor } from './store/store';
import i18next from './utils/i18next';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './index.css';
import App from './App';
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

const RootComponent = () => {
  const lng = useSelector(state => state.localeStore.lng);

  const rtlCache = createCache({
    key: lng === 'fa' ? 'muirtl' : 'muiltr',
    stylisPlugins: lng === 'fa' ? [prefixer, rtlPlugin] : [prefixer],
  });


  return (
    <CacheProvider value={rtlCache}>
        <App />
     </CacheProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
            <QueryClientProvider client={queryClient}>
              <I18nextProvider i18n={i18next}>
                <RootComponent />
              </I18nextProvider>
            </QueryClientProvider>
          </PersistQueryClientProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>
);