import { useEffect, useState } from 'react';
import './snackbar.css';

export default function Snackbar({ message, duration, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false)
      const closeEvent = setTimeout(() => {
        onClose()
      }, 500);
      return () => clearTimeout(closeEvent);
    }, duration);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div className={`purple-shadow snackbar ${visible ? 'show' : ''}`}>
      {message}
    </div>
  );
}