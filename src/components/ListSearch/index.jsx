import React from 'react';
import styles from './index.less';

function ListSearch({ style, filters = [], toolbars = [], onSearch }) {
  const filterNodes = filters.map((item, index) => {
    return (
      <div key={index} className={styles.filter_item}>
        {item}
      </div>
    );
  });

  const toolbarNodes = toolbars.map((item, index) => {
    return (
      <div key={index} className={styles.toolbar_item}>
        {item}
      </div>
    );
  });

  return (
    <div style={style} className={styles.container}>
      <div className={styles.filters}>{filterNodes}</div>
      <div className={styles.toolbars}>{toolbarNodes}</div>
    </div>
  );
}

export default React.memo(ListSearch);
