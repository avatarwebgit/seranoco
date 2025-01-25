import React, { Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

import Loading from './layout/Loading';
import { accesModalActions, persistor, store, userActions } from './store/store';

import FixedNavigation from './layout/FixedNavigation';
import Drawer from './layout/Drawer';

import './App.css';
import { PersistGate } from 'redux-persist/integration/react';
import persistStore from 'redux-persist/es/persistStore';
function App() {
  const [windowSize, setWindowSize] = useState(() => {
    const width = window.innerWidth;
    if (width <= 480) return 'xs';
    if (width > 481 && width <= 768) return 's';
    if (width > 768 && width <= 1024) return 'm';
    if (width > 1024 && width <= 1200) return 'l';
    if (width > 1200) return 'xl';
  });

  const Home = React.lazy(() => import('./pages/Home'));
  const FilterByColor = React.lazy(() => import('./pages/FilterByColor'));
  const FilterByShape = React.lazy(() => import('./pages/FilterByShape'));
  const Products = React.lazy(() => import('./pages/Products'));
  const Profile = React.lazy(() => import('./pages/Profile'));
  const PreCheckout = React.lazy(() => import('./pages/PreCheckout'));
  const PayByCart = React.lazy(() => import('./pages/PayByCart'));
  const New = React.lazy(() => import('./pages/New'));

  const lng = useSelector(state => state.localeStore.lng);
  const token = useSelector(state => state.userStore.token);

  useEffect(() => {
    console.log(token)
  }, [token])
  

  const dispatch = useDispatch();

  const RequireAuth = ({ children }) => {
    return token ? children : <Navigate to={`/${lng}`} replace />;
  };

  useEffect(() => {
    const calculeSize = () => {
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

    window.addEventListener('resize', () => setWindowSize(calculeSize));

    return () => {
      window.removeEventListener('resize', () => setWindowSize(calculeSize));
    };
  }, []);

  useEffect(() => {
    document.body.className = lng === 'fa' ? 'fa' : 'en';
  }, [lng]);

  return (
    <PersistGate loading={null} persistor={persistor}>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path={`/:lng`} element={<Home windowSize={windowSize} />} />
          <Route path={'/'} element={<Navigate to={`/${lng}`} replace />} />
          <Route path={` `} element={<Navigate to={`/${lng}`} replace />} />
          <Route
            path={`/:lng/shopByColor`}
            element={<FilterByColor windowSize={windowSize} />}
          />
          <Route
            path={`/:lng/shopByShape`}
            element={<FilterByShape windowSize={windowSize} />}
          />
          <Route
            path={`/:lng/products/:id`}
            element={<Products windowSize={windowSize} />}
          />
          <Route
            path={`/:lng/myaccount`}
            element={
              <RequireAuth>
                <Profile windowSize={windowSize} />
              </RequireAuth>
            }
          />
          <Route
            path={`/:lng/precheckout`}
            element={
              <RequireAuth>
                <PreCheckout windowSize={windowSize} />
              </RequireAuth>
            }
          />
          <Route
            path={`/:lng/order/pay`}
            element={
              <RequireAuth>
                <PayByCart windowSize={windowSize} />
              </RequireAuth>
            }
          />
          <Route
            path={`/:lng/new-products`}
            element={<New windowSize={windowSize} />}
          />
        </Routes>
        {windowSize === 'xs' && <FixedNavigation />}
        {windowSize === 's' && <FixedNavigation />}
        <Drawer size={windowSize} />
        <ToastContainer
          theme='dark'
          className={'toast'}
          autoClose={5000}
          newestOnTop={true}
          closeButton={false}
          rtl={lng === 'fa' ? true : false}
          pauseOnFocusLoss={false}
          pauseOnHover={true}
        />
      </Suspense>
    </PersistGate>
  );
}

export default App;
