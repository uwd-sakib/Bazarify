import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { customerService } from '../services';
import { handleError, formatCurrency, formatDate } from '../utils/helpers';
import { Plus, Edit, Trash2, Search, User, TrendingUp, AlertCircle, CheckCircle, XCircle, CreditCard, DollarSign, ShoppingCart } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  // Calculate customer trust score dynamically
  const calculateTrustScore = (customer, orders = []) => {
    let score = 50; // Base score
    
    // Factor 1: Order history (up to 25 points)
    const orderCount = orders.length || customer.orderCount || 0;
    score += Math.min(orderCount * 2, 25);
    
    // Factor 2: Payment reliability (up to 25 points)
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length || 0;
    const paymentRate = orderCount > 0 ? (deliveredOrders / orderCount) * 25 : 0;
    score += paymentRate;
    
    // Factor 3: Total spent (up to 15 points)
    const totalSpent = customer.totalSpent || 0;
    if (totalSpent > 50000) score += 15;
    else if (totalSpent > 20000) score += 10;
    else if (totalSpent > 5000) score += 5;
    
    // Factor 4: Account age (up to 10 points)
    const accountAge = customer.createdAt ? 
      Math.floor((new Date() - new Date(customer.createdAt)) / (1000 * 60 * 60 * 24)) : 0;
    if (accountAge > 180) score += 10;
    else if (accountAge > 90) score += 7;
    else if (accountAge > 30) score += 5;
    
    return Math.min(Math.round(score), 100);
  };

  // Get trust level text and color
  const getTrustLevel = (score) => {
    if (score >= 80) return { text: 'উচ্চ', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-700' };
    if (score >= 50) return { text: 'মাঝারি', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' };
    return { text: 'কম', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-700' };
  };

  // Calculate loyalty factors
  const calculateLoyaltyFactors = (customer, orders = []) => {
    const orderCount = orders.length || customer.orderCount || 0;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length || 0;
    const totalSpent = customer.totalSpent || 0;
    
    return {
      accountUsage: Math.min((orderCount / 20) * 100, 100),
      paymentTimeline: orderCount > 0 ? (deliveredOrders / orderCount) * 100 : 0,
      communication: Math.min(customer.email ? 100 : 50, 100),
      creditManagement: totalSpent > 10000 ? 90 : totalSpent > 5000 ? 75 : 60
    };
  };

  // Get AI recommendation
  const getAIRecommendation = (trustScore) => {
    if (trustScore >= 80) {
      return 'বাকি দেওয়া যায়, ছাড় দেওয়া যায়';
    } else if (trustScore >= 50) {
      return 'ছোট বাকি দেওয়া যায়';
    }
    return 'নগদ বিক্রয় করুন';
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        fetchCustomers(searchTerm);
      } else {
        fetchCustomers();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchCustomers = async (search = '') => {
    try {
      setLoading(true);
      const response = await customerService.getAll(search);
      setCustomers(response.data);
      setError('');
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (customer = null) => {
    if (customer) {
      setSelectedCustomer(customer);
      setFormData({
        name: customer.name,
        phone: customer.phone,
        email: customer.email || '',
        address: customer.address || ''
      });
    } else {
      setSelectedCustomer(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (selectedCustomer) {
        await customerService.update(selectedCustomer._id, formData);
        setSuccess('গ্রাহক সফলভাবে আপডেট হয়েছে');
      } else {
        await customerService.create(formData);
        setSuccess('গ্রাহক সফলভাবে যোগ করা হয়েছে');
      }
      handleCloseModal();
      fetchCustomers();
    } catch (err) {
      setError(handleError(err));
    }
  };

  const handleViewDetails = async (customerId) => {
    try {
      const response = await customerService.getById(customerId);
      setCustomerDetails(response.data);
      setShowDetailsModal(true);
    } catch (err) {
      setError(handleError(err));
    }
  };

  const handleDelete = async () => {
    try {
      await customerService.delete(selectedCustomer._id);
      setSuccess('গ্রাহক সফলভাবে মুছে ফেলা হয়েছে');
      fetchCustomers();
    } catch (err) {
      setError(handleError(err));
    }
  };

  if (loading && customers.length === 0) {
    return (
      <Layout title="গ্রাহক">
        <Loading fullScreen />
      </Layout>
    );
  }

  return (
    <Layout title="গ্রাহক">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Customer Loyalty Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">👥</span>
          <h2 className="text-2xl font-bold text-gray-900">ক্রেতা বিশ্বস্ততা</h2>
        </div>
        <p className="text-gray-600">কোন ক্রেতার সাথে কেমন ব্যবহার করবেন তা বুঝুন</p>
      </div>

      {/* Loyalty Explanation */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 mb-8 border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🤝</span>
          <h3 className="text-xl font-bold text-gray-900">বিশ্বস্ততা কোর কী?</h3>
        </div>
        
        <p className="text-gray-700 mb-6 leading-relaxed">
          AI প্রতিটি ক্রেতার পেমেন্ট ইতিহাস, কেনাকাটার নিয়মিততা, এবং আচরণ বিশ্লেষণ করে একটি স্কোর দেয়। এই স্কোর দেখে আপনি সহজেই বুঝতে পারবেন কোন ক্রেতাকে বাকি দিতে পারবেন, কাকে ছাড় দিতে পারবেন।
        </p>

        <div className="space-y-3">
          {/* High Trust */}
          <div className="bg-green-100 border-l-4 border-green-500 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">৮০-১০০: নির্ভরযোগ্য ক্রেতা - বাকি ও ছাড় দেওয়া নিরাপদ</p>
            </div>
          </div>

          {/* Medium Trust */}
          <div className="bg-yellow-100 border-l-4 border-yellow-500 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">৬০-৭৯: মাঝারি - ছোট বাকি দেওয়া যাবে, সাবধানে</p>
            </div>
          </div>

          {/* Low Trust */}
          <div className="bg-red-100 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">০-৫৯: ঝুঁকিপূর্ণ - নগদে বিক্রয় করা ভালো</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header with Search and Add */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">আপনার ধরন ক্রেতারা</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="গ্রাহক অনুসন্ধান করুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-80"
            />
          </div>
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            নতুন গ্রাহক
          </button>
        </div>
      </div>

      {/* Customer Cards */}
      {/* Customer Cards */}
      {customers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {customers.map((customer) => {
            const trustScore = calculateTrustScore(customer, customerDetails?.orders || []);
            const trustLevel = getTrustLevel(trustScore);
            const loyaltyFactors = calculateLoyaltyFactors(customer, customerDetails?.orders || []);
            const aiRecommendation = getAIRecommendation(trustScore, customer);

            return (
              <div key={customer._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                {/* Customer Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 rounded-full p-3">
                      <User className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{customer.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${trustLevel.bgColor} ${trustLevel.textColor} font-medium`}>
                        {trustScore}/100
                      </span>
                      <span className="text-xs ml-2 text-gray-600">বিশ্বস্ততা: {trustLevel.text}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">মোট ক্রয়মূল্য:</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(customer.totalSpent || 0)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">সময়মতো পেমেন্ট:</span>
                    <span className="font-bold text-gray-900">
                      {Math.floor(loyaltyFactors.paymentTimeline)}/{customer.orderCount || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">মূল্য দক্ষতা:</span>
                    <span className={`font-medium ${trustLevel.textColor}`}>
                      {trustLevel.text}
                    </span>
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">💡</span>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">AI পরামর্শ:</p>
                      <p className="text-sm font-semibold text-gray-900">{aiRecommendation}</p>
                    </div>
                  </div>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => handleViewDetails(customer._id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  বিস্তারিত দেখুন →
                </button>

                {/* Trust Score Badge */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600">বিশ্বস্ততার হার</span>
                  <div className="bg-teal-100 border border-teal-300 rounded-lg px-4 py-2">
                    <span className="text-2xl font-bold text-teal-700">{trustScore}</span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mt-3">
                  <div className="bg-blue-500 h-1 rounded-full"></div>
                </div>

                {/* Loyalty Breakdown */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <p className="text-sm font-semibold text-gray-900">বিশ্বস্ততা কীভাবে তৈরি হয়</p>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3">
                    প্রতিটি স্তর ক্রেতার আচরণের একটি দিক দেখায়। সব মিলে সম্পূর্ণ বিশ্বস্ততার ছবি।
                  </p>

                  <div className="space-y-3">
                    {/* Factor 1: Payment Behavior */}
                    <div>
                      <div className="flex items-start gap-2 mb-2">
                        <div className="bg-green-100 rounded p-1.5">
                          <ShoppingCart className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-700 font-medium">পেমেন্ট আচরণ</span>
                            <span className="text-xs font-bold text-green-600">35% গুরুত্ব</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-1">সময়মত টাকা পরিশোধ</p>
                          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(loyaltyFactors.accountUsage, 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-green-600 font-semibold mt-1">অবদান: +32</p>
                        </div>
                      </div>
                    </div>

                    {/* Factor 2: Product Return */}
                    <div>
                      <div className="flex items-start gap-2 mb-2">
                        <div className="bg-blue-100 rounded p-1.5">
                          <DollarSign className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-700 font-medium">পণ্য ফেরত</span>
                            <span className="text-xs font-bold text-blue-600">20% গুরুত্ব</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-1">কম পণ্য ফেরত দেন</p>
                          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(loyaltyFactors.paymentTimeline, 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-blue-600 font-semibold mt-1">অবদান: +18</p>
                        </div>
                      </div>
                    </div>

                    {/* Factor 3: Purchase Consistency */}
                    <div>
                      <div className="flex items-start gap-2 mb-2">
                        <div className="bg-yellow-100 rounded p-1.5">
                          <span className="text-lg">📊</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-700 font-medium">কেনাকাটার ধারাবাহিকতা</span>
                            <span className="text-xs font-bold text-yellow-600">25% গুরুত্ব</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-1">নিয়মিত কেনাকাটা করেন</p>
                          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(loyaltyFactors.communication, 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-yellow-600 font-semibold mt-1">অবদান: +24</p>
                        </div>
                      </div>
                    </div>

                    {/* Factor 4: Purchase Amount */}
                    <div>
                      <div className="flex items-start gap-2 mb-2">
                        <div className="bg-orange-100 rounded p-1.5">
                          <CreditCard className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-700 font-medium">ক্রয়ের পরিমাণ</span>
                            <span className="text-xs font-bold text-orange-600">20% গুরুত্ব</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-1">বড় অর্ডার করেন</p>
                          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-orange-500 h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(loyaltyFactors.creditManagement, 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-orange-600 font-semibold mt-1">অবদান: +16</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Score Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-2">বিশ্বস্ততার ধাপ</p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <div className="bg-green-500 text-white rounded px-3 py-1 text-sm font-bold">32</div>
                      <div className="bg-blue-500 text-white rounded px-3 py-1 text-sm font-bold">18</div>
                      <div className="bg-yellow-500 text-white rounded px-3 py-1 text-sm font-bold">24</div>
                      <div className="bg-orange-500 text-white rounded px-3 py-1 text-sm font-bold">16</div>
                    </div>
                    <div className="bg-teal-500 text-white rounded-lg px-4 py-2">
                      <span className="text-lg font-bold">{trustScore}</span>
                      <p className="text-xs">মোট স্কোর</p>
                    </div>
                  </div>
                </div>

                {/* Price Recommendation */}
                <div className="mt-4 bg-teal-50 rounded-lg p-4 border-l-4 border-teal-500">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">💳</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">বাকি দেওয়ার সুপারিশ</p>
                      <p className="text-2xl font-bold text-teal-600 mb-1">৫,০০০ টাকা পর্যন্ত নিরাপদ</p>
                      <p className="text-xs text-gray-600">
                        উচ্চ বিশ্বস্ততা স্কোর। সময়মত পেমেন্ট এবং নিয়মিত কেনাকাটার রেকর্ড ভালো।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Risk Management Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleOpenModal(customer)}
                    className="flex-1 btn-secondary flex items-center justify-center text-sm"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    সম্পাদনা
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setShowDeleteDialog(true);
                    }}
                    className="flex-1 btn-danger flex items-center justify-center text-sm"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    মুছুন
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500">কোনো গ্রাহক পাওয়া যায়নি</p>
          <button onClick={() => handleOpenModal()} className="btn-primary mt-4">
            প্রথম গ্রাহক যোগ করুন
          </button>
        </div>
      )}

      {/* Risk Management Tips */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-900">⚠️ ঝুঁকি কীভাবে কমাবেন?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tip 1 */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="bg-green-100 rounded-lg p-3 w-fit mb-3">
              <span className="text-3xl">📋</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">বাকির খাতা রাখুন</h3>
            <p className="text-sm text-gray-700">
              প্রতিটি বাকি লেনদেন লিখে রাখুন। AI আপনাকে রিমাইন্ডার দেবে।
            </p>
          </div>

          {/* Tip 2 */}
          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <div className="bg-yellow-100 rounded-lg p-3 w-fit mb-3">
              <span className="text-3xl">🔔</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">নিয়মিত ফলো-আপ</h3>
            <p className="text-sm text-gray-700">
              পেমেন্ট তারিখের আগে WhatsApp এ রিমাইন্ডার পাঠান।
            </p>
          </div>

          {/* Tip 3 */}
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
            <div className="bg-orange-100 rounded-lg p-3 w-fit mb-3">
              <span className="text-3xl">💰</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">ছাড় দিয়ে নগদ নিন</h3>
            <p className="text-sm text-gray-700">
              নগদে কিনলে ছোট ছাড় দিন। এতে বাকির ঝামেলা কমবে।
            </p>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={selectedCustomer ? 'গ্রাহক সম্পাদনা করুন' : 'নতুন গ্রাহক যোগ করুন'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              নাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="গ্রাহকের নাম"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ফোন নম্বর <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="০১XXXXXXXXX"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ইমেইল
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ঠিকানা
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input-field"
              placeholder="সম্পূর্ণ ঠিকানা"
              rows="3"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={handleCloseModal} className="btn-secondary">
              বাতিল
            </button>
            <button type="submit" className="btn-primary">
              {selectedCustomer ? 'আপডেট করুন' : 'যোগ করুন'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Customer Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="গ্রাহক বিস্তারিত"
        size="lg"
      >
        {customerDetails && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b">
              <div>
                <p className="text-sm text-gray-600">নাম</p>
                <p className="font-medium">{customerDetails.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ফোন</p>
                <p className="font-medium">{customerDetails.customer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ইমেইল</p>
                <p className="font-medium">{customerDetails.customer.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ঠিকানা</p>
                <p className="font-medium">{customerDetails.customer.address || '-'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-4 border-b">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">{customerDetails.statistics.totalOrders}</p>
                <p className="text-sm text-gray-600 mt-1">মোট অর্ডার</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(customerDetails.statistics.totalSpent)}
                </p>
                <p className="text-sm text-gray-600 mt-1">মোট খরচ</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">সাম্প্রতিক অর্ডার</h3>
              {customerDetails.orders.length > 0 ? (
                <div className="space-y-2">
                  {customerDetails.orders.map((order) => (
                    <div key={order._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary-600">{formatCurrency(order.totalAmount)}</p>
                        <span className={`text-xs badge ${order.status === 'delivered' ? 'badge-success' : 'badge-warning'}`}>
                          {order.status === 'delivered' ? 'ডেলিভারড' : order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">কোনো অর্ডার নেই</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="গ্রাহক মুছে ফেলুন"
        message={`আপনি কি নিশ্চিত যে "${selectedCustomer?.name}" মুছে ফেলতে চান?`}
        confirmText="মুছে ফেলুন"
      />
    </Layout>
  );
};

export default Customers;
