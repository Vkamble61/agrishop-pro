import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaChartLine, FaShoppingCart, FaBox, FaUsers, FaRupeeSign, 
  FaExclamationTriangle, FaTractor, FaBell, FaArrowUp, FaArrowDown 
} from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import orderService from '../services/orderService';
import equipmentService from '../services/equipmentService';
import './Dashboard.css';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 450000, orders: 12 },
    { month: 'Feb', revenue: 520000, orders: 15 },
    { month: 'Mar', revenue: 680000, orders: 18 },
    { month: 'Apr', revenue: 590000, orders: 16 },
    { month: 'May', revenue: 750000, orders: 22 },
    { month: 'Jun', revenue: 820000, orders: 25 }
  ];

  const categoryData = [
    { name: 'Tractors', value: 45, color: '#2d5016' },
    { name: 'Harvesters', value: 25, color: '#d4880a' },
    { name: 'Ploughs', value: 15, color: '#28a745' },
    { name: 'Seeders', value: 10, color: '#17a2b8' },
    { name: 'Others', value: 5, color: '#6c757d' }
  ];

  const orderStatusData = [
    { status: 'Pending', count: 8 },
    { status: 'Processing', count: 12 },
    { status: 'In Service', count: 5 },
    { status: 'Delivered', count: 45 }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch order statistics
      const statsResponse = await orderService.getOrderStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Fetch recent orders
      const ordersResponse = await orderService.getAllOrders({ limit: 5, sort: '-createdAt' });
      if (ordersResponse.success) {
        setRecentOrders(ordersResponse.data);
      }

      // Fetch low stock items
      const equipmentResponse = await equipmentService.getAllEquipment({ limit: 100 });
      if (equipmentResponse.success) {
        const lowStock = equipmentResponse.data.filter(item => item.quantity <= item.reorderLevel);
        setLowStockItems(lowStock.slice(0, 5));
      }

      // Mock notifications
      setNotifications([
        { id: 1, type: 'order', message: 'New order received - ORD240516001', time: '5 mins ago' },
        { id: 2, type: 'stock', message: 'Low stock alert: Mahindra 575 DI', time: '1 hour ago' },
        { id: 3, type: 'payment', message: 'Payment received for ORD240515023', time: '2 hours ago' }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'badge-warning', text: 'Pending' },
      confirmed: { class: 'badge-info', text: 'Confirmed' },
      processing: { class: 'badge-info', text: 'Processing' },
      in_service: { class: 'badge-warning', text: 'In Service' },
      delivered: { class: 'badge-success', text: 'Delivered' },
      cancelled: { class: 'badge-danger', text: 'Cancelled' }
    };
    const config = statusConfig[status] || { class: '', text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page admin-dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="header-actions">
            <Link to="/admin/inventory" className="btn btn-primary">
              <FaBox /> Manage Inventory
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(45, 80, 22, 0.1)' }}>
              <FaRupeeSign style={{ color: 'var(--color-primary)' }} />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{formatCurrency(stats.totalRevenue)}</h3>
              <p className="stat-label">Total Revenue</p>
              <div className="stat-trend positive">
                <FaArrowUp /> 12.5% from last month
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(212, 136, 10, 0.1)' }}>
              <FaShoppingCart style={{ color: 'var(--color-secondary)' }} />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.totalOrders}</h3>
              <p className="stat-label">Total Orders</p>
              <div className="stat-trend positive">
                <FaArrowUp /> 8.2% from last month
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)' }}>
              <FaBell style={{ color: '#ffc107' }} />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.pendingOrders}</h3>
              <p className="stat-label">Pending Orders</p>
              <div className="stat-trend">
                Requires attention
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)' }}>
              <FaTractor style={{ color: 'var(--color-success)' }} />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.deliveredOrders}</h3>
              <p className="stat-label">Delivered Orders</p>
              <div className="stat-trend positive">
                <FaArrowUp /> 15.3% from last month
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card large">
            <h2 className="card-title">
              <FaChartLine /> Revenue & Orders Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#2d5016" strokeWidth={2} name="Revenue (₹)" />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#d4880a" strokeWidth={2} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2 className="card-title">
              <FaBox /> Equipment by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2 className="card-title">
              <FaShoppingCart /> Orders by Status
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2d5016" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Grid */}
        <div className="dashboard-grid">
          {/* Recent Orders */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">
                <FaShoppingCart /> Recent Orders
              </h2>
              <Link to="/admin/orders" className="card-link">View All</Link>
            </div>
            <div className="card-body">
              {recentOrders.length > 0 ? (
                <div className="orders-list">
                  {recentOrders.map(order => (
                    <div key={order._id} className="order-item">
                      <div className="order-info">
                        <h4 className="order-title">Order #{order.orderNumber}</h4>
                        <p className="order-meta">
                          {order.customer?.name} • {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div className="order-status">
                        {getStatusBadge(order.status)}
                        <p className="order-amount">{formatCurrency(order.totalAmount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No recent orders</p>
              )}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">
                <FaExclamationTriangle /> Low Stock Alerts
              </h2>
              <Link to="/admin/inventory" className="card-link">Manage</Link>
            </div>
            <div className="card-body">
              {lowStockItems.length > 0 ? (
                <div className="stock-list">
                  {lowStockItems.map(item => (
                    <div key={item._id} className="stock-item">
                      <div className="stock-info">
                        <h4 className="stock-name">{item.name}</h4>
                        <p className="stock-brand">{item.brand}</p>
                      </div>
                      <div className="stock-quantity">
                        <span className="quantity-badge danger">
                          {item.quantity} left
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">All items well stocked</p>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="dashboard-card full-width">
            <div className="card-header">
              <h2 className="card-title">
                <FaBell /> Recent Notifications
              </h2>
              <button className="card-link">Mark all as read</button>
            </div>
            <div className="card-body">
              {notifications.length > 0 ? (
                <div className="notifications-list">
                  {notifications.map(notification => (
                    <div key={notification.id} className="notification-item">
                      <div className="notification-content">
                        <p className="notification-message">{notification.message}</p>
                        <p className="notification-time">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No new notifications</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/inventory" className="action-card">
              <FaBox className="action-icon" />
              <h3>Manage Inventory</h3>
              <p>Add or update equipment</p>
            </Link>
            <Link to="/admin/orders" className="action-card">
              <FaShoppingCart className="action-icon" />
              <h3>View Orders</h3>
              <p>Process pending orders</p>
            </Link>
            <Link to="/admin/suppliers" className="action-card">
              <FaUsers className="action-icon" />
              <h3>Suppliers</h3>
              <p>Manage supplier relationships</p>
            </Link>
            <Link to="/admin/loyalty" className="action-card">
              <FaChartLine className="action-icon" />
              <h3>Loyalty Program</h3>
              <p>Manage customer rewards</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

// Made with Bob
