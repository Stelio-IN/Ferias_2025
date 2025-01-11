import React from 'react';
import { useTranslation } from 'react-i18next';

const App = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
      <p>{t('greeting')}</p>
      <p>{t('farewell')}</p>

      <div style={{ marginTop: '20px' }}>
        <p>{t('chooseLanguage')}</p>
        <button onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('pt')}>Português</button>
      </div>

      <div style={{ marginTop: '20px', fontStyle: 'italic' }}>
        <p>{t('currentLanguage')}</p>
      </div>
    </div>
  );
};

export default App;
