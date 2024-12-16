import React, { Suspense, useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { useSelector } from 'react-redux';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

import fa_translation_file from './assets/locales/fa/translation.json';
import en_translation_file from './assets/locales/en/translation.json';

import Loading from './layout/Loading';

import './App.css';
function App() {
  const [windowSize, setWindowSize] = useState('');

  const Home = React.lazy(() => import('./pages/Home'));
  const Categories = React.lazy(() => import('./pages/Categories'));
  const FilterByShape = React.lazy(() => import('./pages/FilterByShape'));

  // const AuthExists = ({ children }) => {
  //   return token ? <Navigate to={"/"} /> : children;
  // };

  // const RequireAuth = ({ children }) => {
  //   return token ? children : <Navigate to={"/login"} />;
  // };

  const lng = useSelector(state => state.localeStore.lng);
  const navigate = useNavigate();
  const location = useLocation();

  const windowsSize = () => {
    const width = window.innerWidth;
    if (width <= 480) {
      return 'xs';
    }
    if (width > 481 && width <= 768) {
      return 's';
    }
    if (width > 768 && width <= 1024) {
      return 'm';
    }
    if (width > 1024 && width <= 1200) {
      return 'l';
    }
    if (width > 1200) {
      return 'xl';
    }
  };

  useEffect(() => {
    window.addEventListener('load', () => setWindowSize(windowsSize));
    window.addEventListener('resize', () => setWindowSize(windowsSize));

    return () => {
      window.removeEventListener('load', () => setWindowSize(windowsSize));
      window.removeEventListener('resize', () => setWindowSize(windowsSize));
    };
  }, []);

  i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(HttpApi)
    .init({
      supportedLngs: ['en', 'fa'],
      fallbackLng: 'en',
      resources: {
        en: {
          translation: en_translation_file, // English translations
        },
        fa: {
          translation: fa_translation_file, // Farsi translations
        },
      },
      detection: {
        order: ['localStorage', 'cookie', 'htmlTag', 'subdomain'],
        caches: ['localStorage'],
      },
    });

  useEffect(() => {
    document.body.className = lng === 'fa' ? 'fa' : 'en';
  }, [lng]);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path={`/:lng`} element={<Home windowSize={windowSize} />} />
        <Route path={'/'} element={<Navigate to={'/en'} replace />} />

        <Route path={` `} element={<Navigate to={`/en`} replace />} />
        <Route path={`/:lng/categories`} element={<Categories />} />
        <Route path={`/:lng/filters`} element={<FilterByShape />} />
        <Route path={`/test`} element={<Loading />} />
      </Routes>
    </Suspense>
  );
}

export default App;
