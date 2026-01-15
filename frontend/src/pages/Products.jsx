import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { productService } from '../services';
import { handleError, formatCurrency } from '../utils/helpers';
import { Plus, Edit, Trash2, Search, Filter, AlertTriangle, CheckCircle, Package } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    status: 'active'
  });

  // Stock analysis states
  const [stockAnalysis, setStockAnalysis] = useState({
    lowStock: [],
    perfectStock: [],
    excessStock: []
  });

  // Analyze stock levels
  const analyzeStock = (productList) => {
    const lowStock = [];
    const perfectStock = [];
    const excessStock = [];

    productList.forEach(product => {
      const stockLevel = product.stock;
      
      // Low stock: less than 50 units
      if (stockLevel < 50) {
        lowStock.push(product);
      }
      // Excess stock: more than 300 units
      else if (stockLevel > 300) {
        excessStock.push(product);
      }
      // Perfect stock: between 50 and 300
      else {
        perfectStock.push(product);
      }
    });

    setStockAnalysis({
      lowStock,
      perfectStock,
      excessStock
    });
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, searchTerm, statusFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      setProducts(response.data);
      analyzeStock(response.data);
      setError('');
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    setFilteredProducts(filtered);
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category,
        description: product.description || '',
        status: product.status
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        price: '',
        stock: '',
        category: '',
        description: '',
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
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
      if (selectedProduct) {
        await productService.update(selectedProduct._id, formData);
        setSuccess('পণ্য সফলভাবে আপডেট হয়েছে');
      } else {
        await productService.create(formData);
        setSuccess('পণ্য সফলভাবে যোগ করা হয়েছে');
      }
      handleCloseModal();
      fetchProducts();
    } catch (err) {
      setError(handleError(err));
    }
  };

  const handleDelete = async () => {
    try {
      await productService.delete(selectedProduct._id);
      setSuccess('পণ্য সফলভাবে মুছে ফেলা হয়েছে');
      fetchProducts();
    } catch (err) {
      setError(handleError(err));
    }
  };

  if (loading) {
    return (
      <Layout title="পণ্য">
        <Loading fullScreen />
      </Layout>
    );
  }

  return (
    <Layout title="পণ্য">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Inventory Management Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📦</span>
          <h2 className="text-2xl font-bold text-gray-900">মজুদ ব্যবস্থাপনা</h2>
        </div>
        <p className="text-gray-600">স্টক শেষ বা অতিরিক্ত মজুদ এড়িয়ে চলুন</p>
      </div>

      {/* AI Stock Management Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 mb-6 border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">📊</span>
          <h3 className="text-xl font-bold text-gray-900">AI কীভাবে মজুদ ট্র্যাক করে?</h3>
        </div>
        
        <p className="text-gray-700 mb-6 leading-relaxed">
          AI আপনার বিক্রয়ের ধরন দেখে বুঝে নেয় প্রতিদিন কত পণ্য বিক্রি হয়। এরপর মজুদ শেষ হওয়ার আগেই সতর্ক করে দেয় এবং কখন অর্ডার করতে হবে তা জানায়।
        </p>

        <div className="space-y-3">
          {/* Low Stock Alert */}
          <div className="bg-red-100 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">কম মজুদ:</p>
              <p className="text-sm text-gray-700">এখনই অর্ডার করুন, নইলে স্টক শেষ হবে</p>
            </div>
          </div>

          {/* Perfect Stock */}
          <div className="bg-green-100 border-l-4 border-green-500 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">পর্যাপ্ত:</p>
              <p className="text-sm text-gray-700">ভালো আছে, এখন অর্ডার করার দরকার নেই</p>
            </div>
          </div>

          {/* Excess Stock Alert */}
          <div className="bg-yellow-100 border-l-4 border-yellow-500 rounded-lg p-4 flex items-start gap-3">
            <Package className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">অতিরিক্ত:</p>
              <p className="text-sm text-gray-700">বেশি মজুদ - দাম কমিয়ে বিক্রি করুন</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Low Stock */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-red-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">কম মজুদ</span>
            <div className="bg-red-100 rounded-lg p-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-2">
            {stockAnalysis.lowStock.length} <span className="text-2xl">টি পণ্য</span>
          </h3>
          {stockAnalysis.lowStock.length > 0 && (
            <p className="text-sm text-red-600 font-medium">স্টক যোগ করুন!</p>
          )}
        </div>

        {/* Perfect Stock */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">পযাই মজুদ</span>
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-2">
            {stockAnalysis.perfectStock.length} <span className="text-2xl">টি পণ্য</span>
          </h3>
          <p className="text-sm text-green-600 font-medium">সঠিক পরিমাণে</p>
        </div>

        {/* Excess Stock */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">অতিরিক্ত মজুদ</span>
            <div className="bg-yellow-100 rounded-lg p-3">
              <Package className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-2">
            {stockAnalysis.excessStock.length} <span className="text-2xl">টি পণ্য</span>
          </h3>
          {stockAnalysis.excessStock.length > 0 && (
            <p className="text-sm text-yellow-600 font-medium">দাম কমান!</p>
          )}
        </div>
      </div>

      {/* Stock List Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">মজুদ তালিকা</h2>
        
        {/* Stock Categories Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Low Stock Products */}
          {stockAnalysis.lowStock.length > 0 && (
            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">⚠️</span>
                <h3 className="font-bold text-gray-900">{stockAnalysis.lowStock[0]?.name}</h3>
              </div>
              <div className="text-sm text-gray-700">
                <p className="mb-1">স্টক: <span className="font-semibold text-red-600">{stockAnalysis.lowStock[0]?.stock} টি</span></p>
                <p className="text-xs text-gray-600">স্টক কম - দ্রুত যোগ করুন</p>
              </div>
            </div>
          )}

          {/* Perfect Stock Products */}
          {stockAnalysis.perfectStock.length > 0 && (
            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">✅</span>
                <h3 className="font-bold text-gray-900">{stockAnalysis.perfectStock[0]?.name}</h3>
              </div>
              <div className="text-sm text-gray-700">
                <p className="mb-1">স্টক: <span className="font-semibold text-green-600">{stockAnalysis.perfectStock[0]?.stock} টি</span></p>
                <p className="text-xs text-gray-600">পযাই মজুদ</p>
              </div>
            </div>
          )}

          {/* Excess Stock Products */}
          {stockAnalysis.excessStock.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">📦</span>
                <h3 className="font-bold text-gray-900">{stockAnalysis.excessStock[0]?.name}</h3>
              </div>
              <div className="text-sm text-gray-700">
                <p className="mb-1">স্টক: <span className="font-semibold text-yellow-600">{stockAnalysis.excessStock[0]?.stock} টি</span></p>
                <p className="text-xs text-gray-600">অতিরিক্ত মজুদ</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Header Actions */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="পণ্য অনুসন্ধান করুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-64"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field pl-10 pr-8"
            >
              <option value="all">সব স্ট্যাটাস</option>
              <option value="active">সক্রিয়</option>
              <option value="inactive">নিষ্ক্রিয়</option>
            </select>
          </div>
        </div>

        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          নতুন পণ্য যোগ করুন
        </button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <span className={`badge ${product.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                  {product.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">মূল্য:</span>
                  <span className="text-lg font-bold text-primary-600">{formatCurrency(product.price)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">স্টক:</span>
                  <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                    {product.stock} টি
                  </span>
                </div>
              </div>

              {product.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenModal(product)}
                  className="flex-1 btn-secondary flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  সম্পাদনা
                </button>
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowDeleteDialog(true);
                  }}
                  className="flex-1 btn-danger flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  মুছুন
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500">কোনো পণ্য পাওয়া যায়নি</p>
          <button onClick={() => handleOpenModal()} className="btn-primary mt-4">
            প্রথম পণ্য যোগ করুন
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={selectedProduct ? 'পণ্য সম্পাদনা করুন' : 'নতুন পণ্য যোগ করুন'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              পণ্যের নাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="পণ্যের নাম লিখুন"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                মূল্য (৳) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input-field"
                placeholder="০"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                স্টক <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="input-field"
                placeholder="০"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ক্যাটাগরি <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
              placeholder="যেমন: ইলেকট্রনিক্স, পোশাক, খাবার"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              বিবরণ
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              placeholder="পণ্যের বিবরণ (ঐচ্ছিক)"
              rows="3"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              স্ট্যাটাস
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field"
            >
              <option value="active">সক্রিয়</option>
              <option value="inactive">নিষ্ক্রিয়</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={handleCloseModal} className="btn-secondary">
              বাতিল
            </button>
            <button type="submit" className="btn-primary">
              {selectedProduct ? 'আপডেট করুন' : 'যোগ করুন'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="পণ্য মুছে ফেলুন"
        message={`আপনি কি নিশ্চিত যে "${selectedProduct?.name}" মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`}
        confirmText="মুছে ফেলুন"
      />
    </Layout>
  );
};

export default Products;
