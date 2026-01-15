import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services';
import { handleError, formatCurrency } from '../utils/helpers';
import Layout from '../components/Layout';
import CircularStatCard from '../components/CircularStatCard';
import AlertNotice from '../components/AlertNotice';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentOrders(5)
      ]);

      setStats(statsRes.data);
      setRecentOrders(ordersRes.data);
    } catch (err) {
      console.error('Dashboard data fetch error:', handleError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="ড্যাশবোর্ড">
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="ড্যাশবোর্ড">
      <div className={styles.dashboard}>
      {/* Header / Top Bar */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>স্বাগতম, {user?.name || 'Sakib Ahmed'}</h1>
          <p>{getBengaliDate()}</p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.profileButton}>
            <span>👤</span>
            <span>প্রোফাইল</span>
          </button>
        </div>
      </div>

      {/* Circular Stat Cards */}
      <div className={styles.statsContainer}>
        <CircularStatCard
          icon="📊"
          number={formatCurrency(stats?.totalSales || 0)}
          label="মোট বিক্রয়"
          color="blue"
        />
        <CircularStatCard
          icon="📦"
          number={stats?.totalProducts || 0}
          label="মোট পণ্য"
          color="green"
        />
        <CircularStatCard
          icon="🛒"
          number={stats?.totalOrders || 0}
          label="মোট অর্ডার"
          color="purple"
        />
        <CircularStatCard
          icon="👥"
          number={stats?.totalCustomers || 0}
          label="মোট গ্রাহক"
          color="orange"
        />
      </div>

      {/* Alert / Notice Section */}
      <AlertNotice
        icon="💡"
        text="আপনার ব্যবসা এই মাসে ভালো পারফরম্যান্স করছে! নতুন পণ্য যুক্ত করতে ভুলবেন না।"
      />

      {/* Main Content Area - 2 Column Grid */}
      <div className={styles.mainContent}>
        {/* Left Column - Recent Activity */}
        <div className={styles.contentCard}>
          <h2>সাম্প্রতিক কার্যক্রম</h2>
          {recentOrders && recentOrders.length > 0 ? (
            <ul className={styles.activityList}>
              {recentOrders.map((order, index) => (
                <li key={index} className={styles.activityItem}>
                  <div className={styles.activityDot}></div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityTitle}>
                      অর্ডার #{order.orderNumber} - {formatCurrency(order.total)}
                    </p>
                    <p className={styles.activityTime}>
                      {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.icon}>📋</div>
              <p>এখনো কোনো কার্যক্রম নেই</p>
            </div>
          )}
        </div>

        {/* Right Column - Quick Stats */}
        <div className={styles.contentCard}>
          <h2>আজকের সারসংক্ষেপ</h2>
          {stats ? (
            <div className={styles.quickStats}>
              <div className={styles.quickStatItem}>
                <span className={styles.quickStatLabel}>আজকের বিক্রয়</span>
                <span className={styles.quickStatValue}>
                  {formatCurrency(stats.todaySales || 0)}
                </span>
              </div>
              <div className={styles.quickStatItem}>
                <span className={styles.quickStatLabel}>আজকের অর্ডার</span>
                <span className={styles.quickStatValue}>
                  {stats.todayOrders || 0}
                </span>
              </div>
              <div className={styles.quickStatItem}>
                <span className={styles.quickStatLabel}>নতুন গ্রাহক</span>
                <span className={styles.quickStatValue}>
                  {stats.newCustomers || 0}
                </span>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.icon}>📊</div>
              <p>ডেটা লোড হচ্ছে...</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
