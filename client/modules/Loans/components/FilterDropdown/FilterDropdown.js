import styles from './FilterDropdown.css';

import React, { PropTypes } from 'react';

export default function FilterDropdown({ name, currentValue, options, onChange, allowEmpty = true }) {
  return (
    <div className={styles['dropdown-area']}>
      {name && <span className={styles['dropdown-label']}>Filter by {name}:</span>}
      <select name={name} className={styles.dropdown} value={currentValue} onChange={onChange}>
        {allowEmpty && <option value={''}>None</option>}
        {options.map((opt, index) =>
          <option key={opt + index} value={opt.toLowerCase()}>
            {opt.charAt(0).toUpperCase() + opt.slice(1).toLowerCase()}
          </option>)
        }
      </select>
    </div>
  );
}

FilterDropdown.propTypes = {
  options: PropTypes.array.isRequired,
  name: PropTypes.string,
  currentValue: PropTypes.any,
  onChange: PropTypes.func,
  allowEmpty: PropTypes.boolean
};
