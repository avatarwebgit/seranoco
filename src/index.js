import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  persistQueryClient,
  PersistQueryClientProvider,
} from "@tanstack/react-query-persist-client";
import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { prefixer } from "stylis";
import App from "./App";
import "./index.css";
import Loading from "./layout/Loading";
import { persistor, store } from "./store/store";
import i18next from "./utils/i18next";

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
  const lng = useSelector((state) => state.localeStore.lng);

  const rtlCache = createCache({
    key: lng === "fa" ? "muirtl" : "muiltr",
    stylisPlugins: lng === "fa" ? [prefixer, rtlPlugin] : [prefixer],
  });

  return (
    <CacheProvider value={rtlCache}>
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    </CacheProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
          >
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
