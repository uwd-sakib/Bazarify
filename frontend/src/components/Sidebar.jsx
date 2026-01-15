import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  Map
} from 'lucide-react';

const Sidebar = () => {
  const { logout, shop } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'ড্যাশবোর্ড' },
    { path: '/munshiji', icon: Sparkles, label: 'মুনশিজী', highlight: true },
    { path: '/products', icon: Package, label: 'পণ্যসমূহ' },
    { path: '/orders', icon: ShoppingCart, label: 'অর্ডারসমূহ' },
    { path: '/customers', icon: Users, label: 'গ্রাহকগণ' },
    { path: '/reports', icon: BarChart3, label: 'রিপোর্ট' },
    { path: '/roadmap', icon: Map, label: 'রোডম্যাপ' },
    { path: '/ai-assistant', icon: Sparkles, label: 'AI চ্যাট' },
    { path: '/settings', icon: Settings, label: 'সেটিংস' }
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img src="/logo.svg" alt="Bazarify" className="w-10 h-10" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Bazarify</h1>
            <p className="text-xs text-gray-500">{shop?.shopName}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? item.highlight 
                    ? 'bg-purple-600 text-white'
                    : 'bg-primary-50 text-primary-700'
                  : item.highlight
                    ? 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
            {item.highlight && (
              <span className="ml-auto text-xs px-2 py-0.5 bg-yellow-400 text-yellow-900 rounded-full font-semibold">
                নতুন
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">লগ আউট</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
