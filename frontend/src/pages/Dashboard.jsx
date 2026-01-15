import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { dashboardService } from '../services';
import { handleError, formatCurrency, formatDate, getOrderStatusColor, getOrderStatusText } from '../utils/helpers';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesChart, setSalesChart] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartPeriod, setChartPeriod] = useState('week');
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'শুভ সকাল';
    if (hour < 17) return 'শুভ দুপুর';
    if (hour < 20) return 'শুভ সন্ধ্যা';
    return 'শুভ রাত্রি';
  };

  // Get current date in Bengali
  const getBengaliDate = () => {
    const date = new Date();
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    
    const day = date.getDate().toString().split('').map(d => bengaliNumerals[parseInt(d)]).join('');
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().split('').map(d => bengaliNumerals[parseInt(d)]).join('');
    
    return `${day} ${month}, ${year}`;
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchSalesChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes, topProductsRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentOrders(5),
        dashboardService.getTopProducts(5)
      ]);

      setStats(statsRes.data);
      setRecentOrders(ordersRes.data);
      setTopProducts(topProductsRes.data);
      setError('');
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesChart = async () => {
    try {
      const response = await dashboardService.getSalesChart(chartPeriod);
      setSalesChart(response.data);
    } catch (err) {
      console.error('Chart fetch error:', err);
    }
  };

  if (loading) {
    return (
      <Layout title="ড্যাশবোর্ড">
        <Loading fullScreen />
      </Layout>
    );
  }

  return (
    <Layout title="ড্যাশবোর্ড">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-8 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, {user?.name}! 👋
            </h1>
            <p className="text-green-50 text-lg">
              আজকের ব্যবসার সারসংক্ষেপ দেখুন
            </p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📅</span>
              <span className="font-semibold">{getBengaliDate()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profit Summary Card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm p-6 mb-6 border border-green-100">
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 rounded-full p-4">
            <span className="text-5xl">💰</span>
          </div>
          <div className="flex-1">
            <p className="text-gray-600 text-sm mb-1">আজকের মোট লাভ</p>
            <h2 className="text-4xl font-bold text-green-700">
              {formatCurrency(stats?.todayProfit || 0)}
            </h2>
            {stats?.profitGrowth !== undefined && (
              <div className="inline-flex items-center mt-2 bg-green-200 text-green-800 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">
                  গতকালের থেকে +{stats.profitGrowth.toFixed(1)}% বৃদ্ধি
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600 text-sm">বিক্রয়</span>
            <div className="bg-blue-100 rounded-lg p-2">
              <span className="text-3xl">📈</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {formatCurrency(stats?.totalSales || 0)}
          </h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600 text-sm">খরচ</span>
            <div className="bg-green-100 rounded-lg p-2">
              <span className="text-3xl">💵</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {formatCurrency(stats?.totalExpenses || 0)}
          </h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600 text-sm">ক্রেতা</span>
            <div className="bg-purple-100 rounded-lg p-2">
              <span className="text-3xl">👥</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {stats?.totalCustomers || 0} জন
          </h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600 text-sm">বিক্রীত পণ্য</span>
            <div className="bg-orange-100 rounded-lg p-2">
              <span className="text-3xl">📦</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {stats?.totalProducts || 0} টি
          </h3>
        </div>
      </div>

      {/* Business Analysis Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">❤️</span>
          <h2 className="text-xl font-bold text-gray-900">আজকের ব্যবসা বিশ্লেষিত</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-3">{getGreeting()}, {user?.name}</h3>
            <p className="text-gray-700 leading-relaxed">আজকের ব্যবসা দারুণ চলছে</p>
          </div>

          {stats && (
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
              <p className="text-gray-800 leading-relaxed mb-3">
                <span className="bg-blue-200 text-blue-900 px-2 py-1 rounded font-semibold">রাত পর্যন্ত</span>{' '}
                আপনার দোকানে আজ{' '}
                <span className="font-bold text-blue-700">{stats.todayCustomers || 0} জন</span>{' '}
                ক্রেতা এসেছেন। তারা মোট{' '}
                <span className="font-bold text-blue-700">{formatCurrency(stats.todaySales || 0)}</span>{' '}
                টাকার পণ্য কিনেছেন।{' '}
                {stats.salesGrowthAmount > 0 && (
                  <span className="text-teal-600 font-semibold">
                    গতকালের চেয়ে {formatCurrency(Math.abs(stats.salesGrowthAmount))} ({Math.abs(stats.salesGrowthPercent).toFixed(1)}%) বৃদ্ধি।
                  </span>
                )}
              </p>
            </div>
          )}

          <div className="bg-amber-50 rounded-lg p-5 border border-amber-100">
            <p className="text-gray-800 leading-relaxed">
              <span className="font-semibold text-amber-900">খরচের হিসাব:</span> সাপ্তাহিক পণ্য (সবজি, বিদ্যুৎ বিল, এবং কর্মচারীর বেতন) মিলিয়ে আজ{' '}
              <span className="font-bold text-amber-700">{formatCurrency(stats?.totalExpenses || 0)}</span> খরচ হয়েছে।
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {stats?.pendingOrders > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              {stats.pendingOrders} টি অর্ডার অপেক্ষমাণ
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              দ্রুত প্রসেস করুন এবং গ্রাহক সন্তুষ্টি বৃদ্ধি করুন
            </p>
          </div>
        </div>
      )}

      {stats?.lowStockProducts > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">
              {stats.lowStockProducts} টি পণ্যের স্টক কম
            </p>
            <p className="text-xs text-red-700 mt-1">
              পণ্য স্টক আপডেট করুন
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              বিক্রয় প্রবণতা
            </h2>
            <div className="flex space-x-2">
              {['week', 'month'].map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    chartPeriod === period
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period === 'week' ? 'সপ্তাহ' : 'মাস'}
                </button>
              ))}
            </div>
          </div>

          {salesChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              কোনো ডেটা নেই
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">জনপ্রিয় পণ্য</h2>
          
          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                      <p className="text-xs text-gray-500">{product.totalSold} বিক্রিত</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-primary-600">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">কোনো ডেটা নেই</p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">সাম্প্রতিক অর্ডার</h2>
        
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    অর্ডার নং
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    গ্রাহক
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    পরিমাণ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    স্ট্যাটাস
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    তারিখ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">কোনো অর্ডার নেই</p>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
