import React from 'react';
import styles from './index.less';

function ListSearch({ style, filters = [], toolbars = [] }) {
  return (
    <div style={style} className={styles.container}>
      <div className={styles.filters}>{filters}</div>
      <div className={styles.toolbars}>{toolbars}</div>
    </div>
  );
}

export default React.memo(ListSearch);
