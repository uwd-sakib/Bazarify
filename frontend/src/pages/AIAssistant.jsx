import { useState, useRef, useEffect } from 'react';
import { Layout } from '../components';
import { aiService, productService, customerService } from '../services';
import { formatCurrency } from '../utils/helpers';
import { Bot, Send, Sparkles, Check, Clock, User, XCircle } from 'lucide-react';

const AIAssistant = () => {
  const [activeTab, setActiveTab] = useState('decisions'); // decisions, chat
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'আসসালামু আলাইকুম! আমি মুন্সিজি - আপনার ব্যবসায়িক উপদেষ্টা। আমি আপনার পণ্য, বিক্রয়, ইনভেন্টরি এবং গ্রাহক ব্যবস্থাপনায় সাহায্য করতে পারি। কিভাবে সাহায্য করতে পারি?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);

  // Dynamic data for AI decisions
  const [priceRecommendations, setPriceRecommendations] = useState([]);
  const [customerAnalysis, setCustomerAnalysis] = useState([]);

  const suggestions = [
    'আমার ব্যবসার জন্য বিশ্লেষণ দিন',
    'কোন পণ্যের স্টক কম আছে?',
    'বিক্রয় বাড়ানোর উপায় বলুন',
    'একটি পণ্যের বর্ণনা লিখুন',
    'গ্রাহকদের জন্য প্রচারমূলক বার্তা তৈরি করুন',
    'আমার বিক্রয় ট্রেন্ড দেখান'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Generate price recommendations from products
  const generatePriceRecommendations = (products) => {
    const recommendations = products
      .filter(p => p.price > 50) // Filter products with meaningful prices
      .slice(0, 3)
      .map((product, index) => {
        const priceReduction = Math.floor(product.price * 0.03) + Math.floor(Math.random() * 5);
        const recommendedPrice = product.price - priceReduction;
        const estimatedSalesIncrease = Math.floor(Math.random() * 50) + 30;
        const times = ['6:00 AM', '6:48 AM', '2:85 PM', '10:30 AM', '3:15 PM'];
        const statuses = index === 1 ? 'pending' : 'completed';
        const confidence = Math.floor(Math.random() * 10) + 85;
        
        return {
          id: index + 1,
          product: product.name,
          time: times[index] || '12:00 PM',
          status: statuses,
          currentPrice: product.price,
          recommendedPrice: recommendedPrice,
          margin: `+${estimatedSalesIncrease} টি আর্টিকুলার বিক্রয়`,
          confidence: confidence
        };
      });
    
    setPriceRecommendations(recommendations);
  };

  // Calculate trust score dynamically
  const calculateTrustScore = (customer) => {
    let score = 50; // Base score
    const orderCount = customer.orderCount || 0;
    score += Math.min(orderCount * 2, 25);
    const totalSpent = customer.totalSpent || 0;
    if (totalSpent > 50000) score += 15;
    else if (totalSpent > 20000) score += 10;
    else if (totalSpent > 5000) score += 5;
    if (customer.createdAt) {
      const accountAge = Math.floor((new Date() - new Date(customer.createdAt)) / (1000 * 60 * 60 * 24));
      if (accountAge > 180) score += 10;
      else if (accountAge > 90) score += 7;
      else if (accountAge > 30) score += 5;
    }
    return Math.min(Math.round(score), 100);
  };

  // Generate customer analysis from customers
  const generateCustomerAnalysis = (customers) => {
    const analysis = customers
      .slice(0, 2)
      .map((customer, index) => {
        const trustScore = calculateTrustScore(customer);
        const orderCount = customer.orderCount || 0;
        const totalSpent = customer.totalSpent || 0;
        const times = ['9:30 AM', '4:40 PM'];
        
        let decision, amount, reason;
        if (trustScore >= 80) {
          decision = 'বাকি দেওয়া হয়েছে';
          amount = formatCurrency(Math.min(totalSpent * 0.3, 10000));
          reason = `নিয়মিত ক্রেতা, ${orderCount} টি অর্ডার সম্পন্ন`;
        } else if (trustScore >= 60) {
          decision = 'ছাড় দেওয়া হয়েছে';
          amount = '৫% (১৮০ টাকা)';
          reason = 'নিয়মিত ক্রেতা, রত অনুরোধ';
        } else {
          decision = 'নগদ বিক্রয়';
          amount = '০ টাকা';
          reason = 'নতুন ক্রেতা';
        }
        
        return {
          id: index + 1,
          name: customer.name,
          score: trustScore,
          scoreLabel: `${trustScore}/100`,
          decision: decision,
          amount: amount,
          reason: reason,
          history: `${orderCount}/20 টি সময়মতো`,
          efficiency: trustScore >= 80 ? 'উচ্চ' : trustScore >= 60 ? 'মাঝারি' : 'কম',
          efficiencyPercent: trustScore,
          time: times[index]
        };
      });
    
    setCustomerAnalysis(analysis);
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchAIData = async () => {
      try {
        const [productsRes, customersRes] = await Promise.all([
          productService.getAll(),
          customerService.getAll()
        ]);
        
        generatePriceRecommendations(productsRes.data);
        generateCustomerAnalysis(customersRes.data);
      } catch (err) {
        console.error('Error fetching AI data:', err);
      }
    };
    
    fetchAIData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowSuggestions(false);
    setLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Use MunshiJi instead of regular chat
      const response = await aiService.munshiJi(text, conversationHistory);
      
      const aiMessage = {
        role: 'assistant',
        content: response.data.response,
        toolsUsed: response.data.toolsUsed || [],
        reasoning: response.data.reasoning || [],
        context: response.data.context
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'দুঃখিত, একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    handleSend(suggestion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleApprovePrice = (id) => {
    setPriceRecommendations(prev =>
      prev.map(rec =>
        rec.id === id ? { ...rec, status: 'completed' } : rec
      )
    );
  };

  const handleRejectPrice = (id) => {
    setPriceRecommendations(prev => prev.filter(rec => rec.id !== id));
  };

  const completedCount = priceRecommendations.filter(r => r.status === 'completed').length;
  const pendingCount = priceRecommendations.filter(r => r.status === 'pending').length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">মুন্সিজি - AI ব্যবসায়িক উপদেষ্টা</h1>
            <p className="text-gray-600">আপনার বিশ্বস্ত ব্যবসায়িক সহকারী</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('decisions')}
            className={`pb-3 px-4 font-medium transition-colors relative ${
              activeTab === 'decisions'
                ? 'text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            AI সিদ্ধান্ত কেন্দ্র
            {activeTab === 'decisions' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-3 px-4 font-medium transition-colors relative ${
              activeTab === 'chat'
                ? 'text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            মুন্সিজি চ্যাট
            {activeTab === 'chat' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
            )}
          </button>
        </div>

        {/* AI Decisions Tab */}
        {activeTab === 'decisions' && (
          <div className="space-y-8">
            {/* AI Decision Center Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">AI সিদ্ধান্ত কেন্দ্র</h2>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">আজকে AI আপনার ব্যবসার জন্য যে সিদ্ধান্ত নিয়েছে</p>
              
              <div className="flex gap-4">
                <div className="bg-green-100 rounded-2xl px-6 py-3 flex items-center gap-3">
                  <div className="bg-green-500 rounded-lg p-2">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">{completedCount}টি করণীয় সম্পন্ন</span>
                </div>
                
                <div className="bg-yellow-100 rounded-2xl px-6 py-3 flex items-center gap-3">
                  <div className="bg-yellow-500 rounded-lg p-2">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">{pendingCount}টি অপেক্ষমাণ</span>
                </div>
              </div>
            </div>

            {/* Price Recommendations Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💰</span>
                <h2 className="text-xl font-bold text-gray-900">দাম সুপারিশ</h2>
              </div>
              <p className="text-gray-600 mb-6">AI বাজার বিশ্লেষণ করে দাম পরিবর্তনের প্রস্তাব নিয়েছে</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {priceRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className={`rounded-xl shadow-sm p-6 border-2 ${
                      rec.status === 'completed'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{rec.product}</h3>
                        <p className="text-sm text-gray-600">{rec.time}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          rec.status === 'completed'
                            ? 'bg-green-200 text-green-800'
                            : 'bg-yellow-200 text-yellow-800'
                        }`}
                      >
                        {rec.status === 'completed' ? 'প্রস্তাব সম্পন্ন' : 'অপেক্ষমাণ'}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between bg-white rounded-lg p-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">আগে</p>
                          <p className="font-bold text-gray-900">{rec.currentPrice} টাকা</p>
                        </div>
                        <div className="text-gray-400">→</div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">এখন</p>
                          <p className="font-bold text-green-600">{rec.recommendedPrice} টাকা</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-lg">💡</span>
                          <div className="flex-1">
                            <p className="text-xs text-gray-600 mb-1">পরিকল্পিত ফলাফল:</p>
                            <p className="font-semibold text-gray-900 text-sm">{rec.margin}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <span className="text-lg">📊</span>
                          <div className="flex-1">
                            <p className="text-xs text-gray-600 mb-2">আত্মবিশ্বাস:</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full transition-all"
                                  style={{ width: `${rec.confidence}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-bold text-gray-900">{rec.confidence}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {rec.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprovePrice(rec.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          অনুমোদন
                        </button>
                        <button
                          onClick={() => handleRejectPrice(rec.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          বাতিল
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Analysis Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🤝</span>
                <h2 className="text-xl font-bold text-gray-900">বিশ্লেষণ-ডিজিটাল সিদ্ধান্ত</h2>
              </div>
              <p className="text-gray-600 mb-6">ক্রেতাদের ইতিহাস লেখে AI যে সিদ্ধান্ত নিয়েছে</p>

              <div className="space-y-6">
                {customerAnalysis.map((customer) => (
                  <div key={customer.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 rounded-full p-3">
                          <User className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{customer.name}</h3>
                          <span className="text-sm text-gray-600">
                            বিশ্বস্ত ক্রেতা:{' '}
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">
                              {customer.scoreLabel}
                            </span>
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{customer.time}</span>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">AI সিদ্ধান্ত:</p>
                          <p className="font-bold text-gray-900 text-lg">{customer.decision}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">পরিমাণ:</p>
                          <p className="font-bold text-teal-600 text-lg">{customer.amount}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">💡</span>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">কারণ:</p>
                          <p className="text-sm text-gray-800">{customer.reason}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="text-lg">📊</span>
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 mb-1">দেনার ইতিহাস:</p>
                          <p className="text-sm font-semibold text-gray-900">{customer.history}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="text-lg">⚠️</span>
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 mb-2">মূল্য দক্ষতা:</p>
                          <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-green-500 h-2.5 rounded-full transition-all"
                              style={{ width: `${customer.efficiencyPercent}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{customer.efficiency}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-[calc(100vh-280px)] flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  <div className="flex flex-col max-w-[70%]">
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                    
                    {/* Show tools used badge */}
                    {message.role === 'assistant' && message.toolsUsed && message.toolsUsed.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2 px-1">
                        {message.toolsUsed.map((tool, idx) => {
                          const toolLabels = {
                            'product_description': '📝 পণ্য বর্ণনা',
                            'business_insights': '📊 ব্যবসা বিশ্লেষণ',
                            'customer_message': '💬 গ্রাহক বার্তা',
                            'sales_trend': '📈 বিক্রয় ট্রেন্ড',
                            'inventory_advice': '📦 ইনভেন্টরি পরামর্শ',
                            'order_report': '📋 অর্ডার রিপোর্ট'
                          };
                          return (
                            <span 
                              key={idx}
                              className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full"
                              title={message.reasoning && message.reasoning[idx] ? message.reasoning[idx] : ''}
                            >
                              {toolLabels[tool] || tool}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {showSuggestions && messages.length === 1 && (
              <div className="px-6 pb-4">
                <p className="text-sm text-gray-600 mb-3">সাজেশনস:</p>
                <div className="grid grid-cols-2 gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors border border-gray-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="আপনার প্রশ্ন লিখুন..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AIAssistant;
