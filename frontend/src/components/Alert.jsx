import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Alert = ({ type = 'info', message, onClose, autoClose = true }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  if (!visible) return null;

  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: AlertCircle
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertCircle
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info
    }
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-4 mb-4 flex items-start space-x-3 fade-in`}>
      <Icon className={`w-5 h-5 ${config.text} flex-shrink-0 mt-0.5`} />
      <p className={`flex-1 text-sm ${config.text}`}>{message}</p>
      <button
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
        className={`${config.text} hover:opacity-70`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Alert;
