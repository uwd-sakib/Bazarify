import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { orderService, customerService, productService } from '../services';
import { handleError, formatCurrency, formatDateTime, getOrderStatusText, getOrderStatusColor } from '../utils/helpers';
import { Plus, Eye, Filter } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [formData, setFormData] = useState({
    customerId: '',
    items: [{ productId: '', quantity: 1 }],
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        orderService.getAll(),
        customerService.getAll(),
        productService.getAll({ status: 'active' })
      ]);
      setOrders(ordersRes.data);
      setCustomers(customersRes.data);
      setProducts(productsRes.data);
      setError('');
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await orderService.create(formData);
      setSuccess('অর্ডার সফলভাবে তৈরি হয়েছে');
      setShowCreateModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      setError(handleError(err));
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await orderService.updateStatus(orderId, status);
      setSuccess('অর্ডার স্ট্যাটাস আপডেট হয়েছে');
      fetchData();
    } catch (err) {
      setError(handleError(err));
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const response = await orderService.getById(orderId);
      setSelectedOrder(response.data);
      setShowDetailsModal(true);
    } catch (err) {
      setError(handleError(err));
    }
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      items: [{ productId: '', quantity: 1 }],
      notes: ''
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1 }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  if (loading) {
    return (
      <Layout title="অর্ডার">
        <Loading fullScreen />
      </Layout>
    );
  }

  return (
    <Layout title="অর্ডার">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Header Actions */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">সব অর্ডার</option>
            <option value="pending">অপেক্ষমাণ</option>
            <option value="processing">প্রক্রিয়াধীন</option>
            <option value="delivered">ডেলিভারড</option>
            <option value="cancelled">বাতিল</option>
          </select>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          নতুন অর্ডার তৈরি করুন
        </button>
      </div>

      {/* Orders Table */}
      {filteredOrders.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">অর্ডার নং</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">গ্রাহক</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">পণ্য সংখ্যা</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">মোট মূল্য</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">স্ট্যাটাস</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">তারিখ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.items.length} টি
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className={`text-sm font-medium rounded-full px-3 py-1 ${getOrderStatusColor(order.status)} border-0 cursor-pointer`}
                      >
                        <option value="pending">অপেক্ষমাণ</option>
                        <option value="processing">প্রক্রিয়াধীন</option>
                        <option value="delivered">ডেলিভারড</option>
                        <option value="cancelled">বাতিল</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewDetails(order._id)}
                        className="text-primary-600 hover:text-primary-900 flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        বিস্তারিত
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500">কোনো অর্ডার পাওয়া যায়নি</p>
        </div>
      )}

      {/* Create Order Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="নতুন অর্ডার তৈরি করুন"
        size="lg"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              গ্রাহক নির্বাচন করুন <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              className="input-field"
              required
            >
              <option value="">গ্রাহক নির্বাচন করুন</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                পণ্য <span className="text-red-500">*</span>
              </label>
              <button type="button" onClick={addItem} className="text-sm text-primary-600 hover:text-primary-700">
                + পণ্য যোগ করুন
              </button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={item.productId}
                  onChange={(e) => updateItem(index, 'productId', e.target.value)}
                  className="input-field flex-1"
                  required
                >
                  <option value="">পণ্য নির্বাচন করুন</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} - {formatCurrency(product.price)} (স্টক: {product.stock})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                  className="input-field w-24"
                  placeholder="পরিমাণ"
                  min="1"
                  required
                />
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="btn-danger"
                  >
                    মুছুন
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">নোট</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows="3"
              placeholder="অতিরিক্ত তথ্য (ঐচ্ছিক)"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">
              বাতিল
            </button>
            <button type="submit" className="btn-primary">
              অর্ডার তৈরি করুন
            </button>
          </div>
        </form>
      </Modal>

      {/* Order Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="অর্ডার বিস্তারিত"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b">
              <div>
                <p className="text-sm text-gray-600">অর্ডার নম্বর</p>
                <p className="font-medium">{selectedOrder.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">স্ট্যাটাস</p>
                <span className={`badge ${getOrderStatusColor(selectedOrder.status)}`}>
                  {getOrderStatusText(selectedOrder.status)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">গ্রাহক</p>
                <p className="font-medium">{selectedOrder.customerName}</p>
                <p className="text-sm text-gray-500">{selectedOrder.customerPhone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">তারিখ</p>
                <p className="font-medium">{formatDateTime(selectedOrder.createdAt)}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">পণ্য তালিকা</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">পণ্য</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">মূল্য</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">পরিমাণ</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">সাবটোটাল</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm">{item.productName}</td>
                      <td className="px-4 py-3 text-sm">{formatCurrency(item.price)}</td>
                      <td className="px-4 py-3 text-sm">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm font-medium">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">মোট মূল্য:</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(selectedOrder.totalAmount)}
                </span>
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-1">নোট:</p>
                <p className="text-sm">{selectedOrder.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Orders;
