import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Alert from '../components/Alert';
import { shopService, authService } from '../services';
import { handleError, validateEmail } from '../utils/helpers';
import { Store, User, Lock } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('shop');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [shopData, setShopData] = useState({
    shopName: '',
    phone: '',
    address: '',
    description: ''
  });

  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchShopInfo();
  }, []);

  const fetchShopInfo = async () => {
    try {
      const response = await shopService.getInfo();
      setShopData({
        shopName: response.data.shopName,
        phone: response.data.phone || '',
        address: response.data.address || '',
        description: response.data.description || ''
      });

      const userResponse = await authService.getMe();
      setProfileData({
        name: userResponse.data.user.name,
        email: userResponse.data.user.email
      });
    } catch (err) {
      setError(handleError(err));
    }
  };

  const handleShopUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await shopService.updateInfo(shopData);
      setSuccess('দোকানের তথ্য সফলভাবে আপডেট হয়েছে');
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(profileData.email)) {
      setError('সঠিক ইমেইল প্রদান করুন');
      return;
    }

    setLoading(true);

    try {
      await shopService.updateProfile(profileData);
      setSuccess('প্রোফাইল সফলভাবে আপডেট হয়েছে');
      
      // Update local storage
      const user = JSON.parse(localStorage.getItem('user'));
      user.name = profileData.name;
      user.email = profileData.email;
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');

    if (passwordData.newPassword.length < 6) {
      setError('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('নতুন পাসওয়ার্ড মিলছে না');
      return;
    }

    setLoading(true);

    try {
      await authService.updatePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccess('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'shop', label: 'দোকানের তথ্য', icon: Store },
    { id: 'profile', label: 'প্রোফাইল', icon: User },
    { id: 'password', label: 'পাসওয়ার্ড', icon: Lock }
  ];

  return (
    <Layout title="সেটিংস">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Shop Settings */}
            {activeTab === 'shop' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">দোকানের তথ্য</h2>
                <form onSubmit={handleShopUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      দোকানের নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shopData.shopName}
                      onChange={(e) => setShopData({ ...shopData, shopName: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ফোন নম্বর
                    </label>
                    <input
                      type="tel"
                      value={shopData.phone}
                      onChange={(e) => setShopData({ ...shopData, phone: e.target.value })}
                      className="input-field"
                      placeholder="০১XXXXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ঠিকানা
                    </label>
                    <textarea
                      value={shopData.address}
                      onChange={(e) => setShopData({ ...shopData, address: e.target.value })}
                      className="input-field"
                      rows="3"
                      placeholder="দোকানের সম্পূর্ণ ঠিকানা"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      বিবরণ
                    </label>
                    <textarea
                      value={shopData.description}
                      onChange={(e) => setShopData({ ...shopData, description: e.target.value })}
                      className="input-field"
                      rows="4"
                      placeholder="দোকান সম্পর্কে সংক্ষিপ্ত বিবরণ"
                    ></textarea>
                  </div>

                  <div className="pt-4">
                    <button type="submit" disabled={loading} className="btn-primary">
                      {loading ? <div className="loading"></div> : 'আপডেট করুন'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">প্রোফাইল তথ্য</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ইমেইল <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <button type="submit" disabled={loading} className="btn-primary">
                      {loading ? <div className="loading"></div> : 'আপডেট করুন'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Password Settings */}
            {activeTab === 'password' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">পাসওয়ার্ড পরিবর্তন</h2>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      বর্তমান পাসওয়ার্ড <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      নতুন পাসওয়ার্ড <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="input-field"
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      নতুন পাসওয়ার্ড নিশ্চিত করুন <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <button type="submit" disabled={loading} className="btn-primary">
                      {loading ? <div className="loading"></div> : 'পাসওয়ার্ড পরিবর্তন করুন'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
