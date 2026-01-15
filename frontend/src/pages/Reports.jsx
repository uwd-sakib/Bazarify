import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { dashboardService } from '../services';
import { handleError, formatCurrency } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package } from 'lucide-react';

const Reports = () => {
  const [salesChart, setSalesChart] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchReports();
  }, [period]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [salesRes, productsRes] = await Promise.all([
        dashboardService.getSalesChart(period),
        dashboardService.getTopProducts(10)
      ]);
      setSalesChart(salesRes.data);
      setTopProducts(productsRes.data);
      setError('');
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  if (loading) {
    return (
      <Layout title="রিপোর্ট">
        <Loading fullScreen />
      </Layout>
    );
  }

  return (
    <Layout title="রিপোর্ট">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Period Selector */}
      <div className="mb-6">
        <div className="inline-flex bg-white rounded-lg shadow-sm">
          {['week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-3 font-medium transition-colors ${
                period === p
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              } ${p === 'week' ? 'rounded-l-lg' : p === 'year' ? 'rounded-r-lg' : ''}`}
            >
              {p === 'week' ? 'সপ্তাহ' : p === 'month' ? 'মাস' : 'বছর'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            বিক্রয় বিশ্লেষণ
          </h2>
          {salesChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              কোনো ডেটা নেই
            </div>
          )}
        </div>

        {/* Top Products Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            জনপ্রিয় পণ্য বিতরণ
          </h2>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProducts}
                  dataKey="totalSold"
                  nameKey="productName"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              কোনো ডেটা নেই
            </div>
          )}
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">সর্বাধিক বিক্রিত পণ্য</h2>
        {topProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">র‍্যাঙ্ক</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">পণ্যের নাম</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">বিক্রিত</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">আয়</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProducts.map((product, index) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-bold text-sm">{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.totalSold} টি
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {formatCurrency(product.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">কোনো ডেটা নেই</p>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
