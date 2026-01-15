const Loading = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading mx-auto mb-4" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="loading" style={{ borderColor: '#e5e7eb', borderTopColor: '#0ea5e9' }}></div>
    </div>
  );
};

export default Loading;
