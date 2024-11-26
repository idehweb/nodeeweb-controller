import { useCallback } from 'react';
import _isEqual from 'lodash/isEqual';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Snackbar } from '@mui/material';

import { SaveData } from '@/functions';
import createRoutes from '@/DefaultRoute';
import NotFound from '@/views/_404';

export default function APP(props) {
  const { t } = useTranslation();

  let routes = [];
  // @ts-ignore
  const themeData = useSelector((st) => st.store.themeData, _isEqual);
  const menuContact = useSelector((st) => st.store.menuContact);

  // @ts-ignore
  const appUpdate = useSelector((st) => st.store.appUpdate);

  const reloadPage = useCallback(() => {
    const { waiting } = appUpdate;
    if (waiting) waiting.postMessage({ type: 'SKIP_WAITING' });
    SaveData({ appUpdate: null });
    window.location.reload();
  }, [appUpdate]);

  if (!navigator.onLine)
    return (
      <div className={t('languageDir')} dir={t('languageDir')}>
        <div className="textAlignCenter">{t('no internet')}</div>
      </div>
    );

  if (!themeData || (themeData && !themeData.models)) return null;
  if (themeData && themeData.routes) {
    routes = createRoutes(themeData.routes);
  }
console.log("routes",routes)
  return (
    <div className={t('languageDir') + ' '+(menuContact ? 'menuContact' : '')} dir={t('languageDir')}>
      <Snackbar
        open={Boolean(appUpdate)}
        ContentProps={{
          sx: [
            { justifyContent: 'center', fontFamily: 'IRANSans !important' },
            'root' && {
              '& > div': {
                textAlign: 'center',
                alignItems: 'center',
                m: '0 !important',
                padding: 0,
                fontSize: 16,
              },
            },
          ],
        }}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={
          <div tabIndex={0} role="button" onClick={reloadPage}>
            برای نصب نسخه جدید کلیک کنید.
          </div>
        }
        sx={{
          bottom: '10%',
          left: 20,
          right: 20,
          transform: 'none',
          zIndex: 99999,
        }}
      />

      <BrowserRouter>
        <Routes>
          {routes.map((route, idx) => (
            <Route
              key={idx}
              path={route.path}
              element={
                <route.layout {...props} themeData={themeData}>
                  <route.element elements={route.elements} />
                </route.layout>
              }
            />
          ))}
          <Route path="*" element={NotFound} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
