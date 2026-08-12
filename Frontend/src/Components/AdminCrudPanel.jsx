import React, { useState } from 'react';
import styles from '../Styles/admin.module.css';

const AdminCrudPanel = ({
  title,
  description,
  icon,
  primaryLabel,
  secondaryLabel,
  tertiaryLabel,
  dangerLabel,
  onPrimary,
  onSecondary,
  onTertiary,
  onDanger,
}) => {
  const [busy, setBusy] = useState(false);

  const handleAction = async (callback) => {
    if (!callback) return;
    setBusy(true);
    try {
      await callback();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.adminPanelCard}>
      <div className={styles.panelHeader}>
        <div className={styles.panelIcon}>{icon}</div>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      <div className={styles.panelActions}>
        {primaryLabel && (
          <button
            type="button"
            className={`${styles.actionButton} ${styles.successButton}`}
            onClick={() => handleAction(onPrimary)}
            disabled={busy}
          >
            {primaryLabel}
          </button>
        )}

        {secondaryLabel && (
          <button
            type="button"
            className={`${styles.actionButton} ${styles.primaryButton}`}
            onClick={() => handleAction(onSecondary)}
            disabled={busy}
          >
            {secondaryLabel}
          </button>
        )}

        {tertiaryLabel && (
          <button
            type="button"
            className={`${styles.actionButton} ${styles.warningButton}`}
            onClick={() => handleAction(onTertiary)}
            disabled={busy}
          >
            {tertiaryLabel}
          </button>
        )}

        {dangerLabel && (
          <button
            type="button"
            className={`${styles.actionButton} ${styles.dangerButton}`}
            onClick={() => handleAction(onDanger)}
            disabled={busy}
          >
            {dangerLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminCrudPanel;
