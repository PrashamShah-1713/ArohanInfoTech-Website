import React, { useEffect } from 'react'
import styles from '../Styles/notification.module.css'

const Notification = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    if (!message) return

    const timer = setTimeout(() => {
      onClose?.()
    }, 4000)

    return () => clearTimeout(timer)
  }, [message, onClose])

  if (!message) return null

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <span>{message}</span>
      <button type="button" onClick={onClose} className={styles.closeButton} aria-label="Close notification">
        ×
      </button>
    </div>
  )
}

export default Notification
