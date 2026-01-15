export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const getOrderStatusText = (status) => {
  const statusMap = {
    pending: 'অপেক্ষমাণ',
    processing: 'প্রক্রিয়াধীন',
    delivered: 'ডেলিভারড',
    cancelled: 'বাতিল'
  };
  return statusMap[status] || status;
};

export const getOrderStatusColor = (status) => {
  const colorMap = {
    pending: 'badge-warning',
    processing: 'badge-info',
    delivered: 'badge-success',
    cancelled: 'badge-danger'
  };
  return colorMap[status] || 'badge-info';
};

export const getProductStatusText = (status) => {
  return status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়';
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^01[3-9]\d{8}$/;
  return re.test(phone);
};

export const handleError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors) {
    return error.response.data.errors.map(e => e.message).join(', ');
  }
  return 'একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন';
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
