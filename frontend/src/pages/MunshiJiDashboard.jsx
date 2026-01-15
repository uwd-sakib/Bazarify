import { useState, useEffect } from 'react';
import { Layout } from '../components';
import { aiService } from '../services';
import { 
  Sparkles, 
  RefreshCw, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Package,
  DollarSign,
  Megaphone,
  Users,
  Truck,
  PlusCircle,
  ChevronRight,
  Loader2
} from 'lucide-react';

const MunshiJiDashboard = () => {
  const [advice, setAdvice] = useState(null);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch daily advice on mount
  useEffect(() => {
    fetchDailyAdvice();
  }, []);

  const fetchDailyAdvice = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await aiService.munshiJi('আজকের ব্যবসায়িক পরামর্শ দিন');
      
      if (response.success) {
        setAdvice(response.data.response);
        setActions(response.data.actions || []);
        setLastUpdated(new Date());
      } else {
        setError('পরামর্শ পেতে ব্যর্থ হয়েছে');
      }
    } catch (err) {
      console.error('Error fetching advice:', err);
      setError('সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDailyAdvice();
  };

  // Parse advice into sections
  const parseAdviceSections = (adviceText) => {
    if (!adviceText) return {};
    
    const sections = {};
    const situationMatch = adviceText.match(/\*\*পরিস্থিতি[:\s]*\*\*\s*([^\*]+)/i);
    const problemMatch = adviceText.match(/\*\*মূল সমস্যা[:\s]*\*\*\s*([^\*]+)/i);
    const recommendationMatch = adviceText.match(/\*\*সুপারিশ[:\s]*\*\*\s*([^\*]+)/i);
    const actionMatch = adviceText.match(/\*\*কর্মপদক্ষেপ[:\s]*\*\*\s*([\s\S]+)$/i);
    
    if (situationMatch) sections.situation = situationMatch[1].trim();
    if (problemMatch) sections.problem = problemMatch[1].trim();
    if (recommendationMatch) sections.recommendation = recommendationMatch[1].trim();
    if (actionMatch) sections.actionSteps = actionMatch[1].trim();
    
    return sections;
  };

  const sections = parseAdviceSections(advice);

  // Get action icon based on type
  const getActionIcon = (type) => {
    const icons = {
      increase_stock: Package,
      adjust_price: DollarSign,
      promote_product: Megaphone,
      start_marketing: Megaphone,
      engage_customers: Users,
      improve_delivery: Truck,
      expand_inventory: PlusCircle
    };
    return icons[type] || AlertCircle;
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600 bg-red-50 border-red-200',
      medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      low: 'text-green-600 bg-green-50 border-green-200'
    };
    return colors[priority] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  // Get priority label in Bangla
  const getPriorityLabel = (priority) => {
    const labels = {
      high: 'উচ্চ',
      medium: 'মাঝারি',
      low: 'কম'
    };
    return labels[priority] || priority;
  };

  // Get urgency badge
  const getUrgencyBadge = (urgency) => {
    const badges = {
      urgent: { icon: '⚡', text: 'জরুরী', color: 'bg-red-100 text-red-800' },
      soon: { icon: '⏰', text: 'শীঘ্রই', color: 'bg-yellow-100 text-yellow-800' },
      normal: { icon: '📅', text: 'সাধারণ', color: 'bg-blue-100 text-blue-800' }
    };
    return badges[urgency] || badges.normal;
  };

  // Handle action button click
  const handleActionClick = (action) => {
    // Implement action handlers based on type
    switch (action.type) {
      case 'increase_stock':
        window.location.href = `/products?highlight=${action.target.productId}`;
        break;
      case 'adjust_price':
        window.location.href = `/products?highlight=${action.target.productId}`;
        break;
      case 'promote_product':
        // Navigate to marketing page or show campaign creator
        alert(`প্রচার শুরু করুন: ${action.target.productName}`);
        break;
      case 'start_marketing':
        // Navigate to marketing wizard
        alert('মার্কেটিং ক্যাম্পেইন তৈরি করুন');
        break;
      case 'engage_customers':
        window.location.href = '/customers';
        break;
      case 'improve_delivery':
        window.location.href = '/orders?status=pending';
        break;
      case 'expand_inventory':
        window.location.href = '/products';
        break;
      default:
        console.log('Action:', action);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-600" />
              মুন্সিজি - AI ব্যবসায়িক উপদেষ্টা
            </h1>
            <p className="text-gray-600 mt-1">
              আপনার ব্যক্তিগত ব্যবসায়িক পরামর্শদাতা
            </p>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            নতুন পরামর্শ
          </button>
        </div>

        {/* Last Updated */}
        {lastUpdated && !loading && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Clock className="w-4 h-4" />
            সর্বশেষ আপডেট: {lastUpdated.toLocaleTimeString('bn-BD', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
            <p className="text-lg text-gray-600">পরামর্শ প্রস্তুত করা হচ্ছে...</p>
            <p className="text-sm text-gray-500 mt-2">
              আপনার ব্যবসার তথ্য বিশ্লেষণ করা হচ্ছে
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-1">
                  সমস্যা হয়েছে
                </h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-3 text-sm text-red-600 hover:text-red-700 underline"
                >
                  আবার চেষ্টা করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success State - Show Advice */}
        {!loading && !error && advice && (
          <div className="space-y-6">
            {/* AI Insight Card */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    আজকের ব্যবসায়িক পরামর্শ
                  </h2>

                  {/* Situation */}
                  {sections.situation && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        পরিস্থিতি
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {sections.situation}
                      </p>
                    </div>
                  )}

                  {/* Problem */}
                  {sections.problem && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        মূল সমস্যা
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {sections.problem}
                      </p>
                    </div>
                  )}

                  {/* Recommendation */}
                  {sections.recommendation && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        সুপারিশ
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {sections.recommendation}
                      </p>
                    </div>
                  )}

                  {/* Action Steps (from text) */}
                  {sections.actionSteps && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        কর্মপদক্ষেপ
                      </h3>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {sections.actionSteps}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Structured Actions */}
            {actions.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  প্রস্তাবিত পদক্ষেপ ({actions.length})
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {actions.map((action) => {
                    const Icon = getActionIcon(action.type);
                    const urgencyBadge = getUrgencyBadge(action.urgency);
                    
                    return (
                      <div
                        key={action.id}
                        className={`bg-white rounded-lg border-2 p-5 hover:shadow-md transition-shadow ${getPriorityColor(action.priority)}`}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              action.priority === 'high' ? 'bg-red-100' :
                              action.priority === 'medium' ? 'bg-yellow-100' :
                              'bg-green-100'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${urgencyBadge.color}`}>
                                {urgencyBadge.icon} {urgencyBadge.text}
                              </span>
                            </div>
                          </div>
                          
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-white border">
                            {getPriorityLabel(action.priority)}
                          </span>
                        </div>

                        {/* Action Type Title */}
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {getActionTitle(action.type)}
                        </h3>

                        {/* Target Info */}
                        {action.target && (
                          <div className="mb-3">
                            {renderTargetInfo(action.type, action.target)}
                          </div>
                        )}

                        {/* Reason */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {action.reason}
                        </p>

                        {/* Action Button */}
                        <button
                          onClick={() => handleActionClick(action)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                        >
                          {getActionButtonText(action.type)}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No Actions */}
            {actions.length === 0 && !loading && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  সব ঠিক আছে! 🎉
                </h3>
                <p className="text-green-700">
                  এই মুহূর্তে কোনো জরুরী পদক্ষেপ প্রয়োজন নেই। আপনার ব্যবসা ভালো চলছে।
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

// Helper function to get action title
const getActionTitle = (type) => {
  const titles = {
    increase_stock: 'স্টক বাড়ান',
    adjust_price: 'দাম সমন্বয় করুন',
    promote_product: 'পণ্য প্রচার করুন',
    start_marketing: 'মার্কেটিং শুরু করুন',
    engage_customers: 'গ্রাহক যুক্ততা বাড়ান',
    improve_delivery: 'ডেলিভারি উন্নত করুন',
    expand_inventory: 'ইনভেন্টরি সম্প্রসারণ করুন'
  };
  return titles[type] || type;
};

// Helper function to render target info
const renderTargetInfo = (type, target) => {
  switch (type) {
    case 'increase_stock':
      return (
        <div className="text-sm">
          <p className="font-medium text-gray-900">{target.productName}</p>
          <p className="text-gray-600">
            বর্তমান: {target.currentStock}টি → প্রস্তাবিত: {target.suggestedStock}টি
          </p>
        </div>
      );
    
    case 'adjust_price':
      return (
        <div className="text-sm">
          <p className="font-medium text-gray-900">{target.productName}</p>
          <p className="text-gray-600">
            ৳{target.currentPrice} → ৳{target.suggestedPrice}
            <span className="ml-1 text-red-600">({target.discount}% ছাড়)</span>
          </p>
        </div>
      );
    
    case 'promote_product':
      return (
        <div className="text-sm">
          <p className="font-medium text-gray-900">{target.productName}</p>
          <p className="text-gray-600">মোট বিক্রয়: {target.salesCount} বার</p>
        </div>
      );
    
    case 'start_marketing':
      return (
        <div className="text-sm">
          <p className="text-gray-600 mb-1">প্ল্যাটফর্ম:</p>
          <div className="flex flex-wrap gap-1">
            {target.channels?.map((channel, idx) => (
              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                {channel}
              </span>
            ))}
          </div>
          <p className="text-gray-600 mt-1">বাজেট: ৳{target.budget}</p>
        </div>
      );
    
    case 'engage_customers':
      return (
        <div className="text-sm">
          <p className="text-gray-600">{target.count} জন গ্রাহক</p>
          <p className="text-gray-600">অফার: লয়ালটি ডিসকাউন্ট</p>
        </div>
      );
    
    case 'improve_delivery':
      return (
        <div className="text-sm">
          <p className="text-gray-600">
            বর্তমান হার: {target.currentRate}% → লক্ষ্য: {target.targetRate}%
          </p>
          <p className="text-gray-600">{target.pendingOrders}টি অপেক্ষমাণ অর্ডার</p>
        </div>
      );
    
    case 'expand_inventory':
      return (
        <div className="text-sm">
          <p className="text-gray-600">
            {target.currentProducts}টি → {target.suggestedProducts}টি পণ্য
          </p>
        </div>
      );
    
    default:
      return null;
  }
};

// Helper function to get action button text
const getActionButtonText = (type) => {
  const texts = {
    increase_stock: 'স্টক আপডেট করুন',
    adjust_price: 'দাম আপডেট করুন',
    promote_product: 'প্রচার শুরু করুন',
    start_marketing: 'ক্যাম্পেইন তৈরি করুন',
    engage_customers: 'অফার পাঠান',
    improve_delivery: 'অর্ডার দেখুন',
    expand_inventory: 'পণ্য যোগ করুন'
  };
  return texts[type] || 'পদক্ষেপ নিন';
};

export default MunshiJiDashboard;
