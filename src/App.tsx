import React, { FC } from 'react';
import { ReactComponent as Icon } from '@assets/SettingsGeneral.svg';
import { render } from 'react-dom';

import styles from './index.module.scss';

const App: FC = () => {
  return (
    <div className={styles.container}>
      <Icon />
      Hi there, I'm React from Webpack 5.
    </div>
  );
}

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root") as HTMLDivElement,
);
