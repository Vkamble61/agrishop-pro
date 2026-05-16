import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTractor, FaShoppingCart, FaTools, FaChartLine, FaBox, FaBell } from 'react-icons/fa';
import './Dashboard.css';

const FarmerDashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);

    // Mock data - will be replaced with API calls
    setTimeout(() => {
      setOrders([
        {
          id: 'ORD001',
          equipment: 'Mahindra 575 DI Tractor',
          status: 'delivered',
          date: '2024-01-15',
          amount: 850000
        },
        {
          id: 'ORD002',
          equipment: 'Rotavator',
          status: 'in_service',
          date: '2024-01-20',
          amount: 45000
        },
        {
          id: 'ORD003',
          equipment: 'Seed Drill Machine',
          status: 'pending',
          date: '2024-01-25',
          amount: 35000
        }
      ]);

      setEquipment([
        {
          id: 'EQ001',
          name: 'Mahindra 575 DI Tractor',
          status: 'owned',
          purchaseDate: '2024-01-15',
          nextService: '2024-07-15'
        },
        {
          id: 'EQ002',
          name: 'Rotavator',
          status: 'rented',
          rentalEnd: '2024-02-20'
        }
      ]);

      setNotifications([
        {
          id: 1,
          type: 'service',
          message: 'Your tractor service is due in 15 days',
          date: '2024-01-25',
          read: false
        },
        {
          id: 2,
          type: 'offer',
          message: 'New EMI scheme available with 0% interest for first 3 months',
          date: '2024-01-24',
          read: false
        },
        {
          id: 3,
          type: 'order',
          message: 'Your order ORD003 is being processed',
          date: '2024-01-25',
          read: true
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      delivered: { class: 'badge-success', text: 'Delivered' },
      in_service: { class: 'badge-warning', text: 'In Service' },
      pending: { class: 'badge-info', text: 'Pending' },
      owned: { class: 'badge-success', text: 'Owned' },
      rented: { class: 'badge-warning', text: 'Rented' }
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
    <div className="dashboard-page">
      <div className="container">
        {/* Welcome Section */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Welcome back, {user?.name}!</h1>
            <p className="dashboard-subtitle">{user?.village}</p>
          </div>
          <Link to="/equipment" className="btn btn-primary">
            <FaTractor /> Browse Equipment
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(45, 80, 22, 0.1)' }}>
              <FaShoppingCart style={{ color: 'var(--color-primary)' }} />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{orders.length}</h3>
              <p className="stat-label">Total Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(212, 136, 10, 0.1)' }}>
              <FaBox style={{ color: 'var(--color-secondary)' }} />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{equipment.length}</h3>
              <p className="stat-label">My Equipment</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)' }}>
              <FaTools style={{ color: 'var(--color-success)' }} />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">
                {orders.filter(o => o.status === 'in_service').length}
              </h3>
              <p className="stat-label">In Service</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(23, 162, 184, 0.1)' }}>
              <FaBell style={{ color: 'var(--color-info)' }} />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">
                {notifications.filter(n => !n.read).length}
              </h3>
              <p className="stat-label">New Notifications</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* Recent Orders */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">
                <FaShoppingCart /> Recent Orders
              </h2>
              <Link to="/farmer/orders" className="card-link">View All</Link>
            </div>
            <div className="card-body">
              {orders.length > 0 ? (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-item">
                      <div className="order-info">
                        <h4 className="order-title">{order.equipment}</h4>
                        <p className="order-meta">
                          Order #{order.id} • {new Date(order.date).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div className="order-status">
                        {getStatusBadge(order.status)}
                        <p className="order-amount">₹{order.amount.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No orders yet</p>
              )}
            </div>
          </div>

          {/* My Equipment */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">
                <FaBox /> My Equipment
              </h2>
              <Link to="/farmer/equipment" className="card-link">View All</Link>
            </div>
            <div className="card-body">
              {equipment.length > 0 ? (
                <div className="equipment-list">
                  {equipment.map(item => (
                    <div key={item.id} className="equipment-item">
                      <div className="equipment-info">
                        <h4 className="equipment-title">{item.name}</h4>
                        <p className="equipment-meta">
                          {item.status === 'owned' 
                            ? `Purchased: ${new Date(item.purchaseDate).toLocaleDateString('en-IN')}`
                            : `Rental ends: ${new Date(item.rentalEnd).toLocaleDateString('en-IN')}`
                          }
                        </p>
                      </div>
                      <div className="equipment-status">
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No equipment yet</p>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="dashboard-card full-width">
            <div className="card-header">
              <h2 className="card-title">
                <FaBell /> Notifications
              </h2>
              <button className="card-link">Mark all as read</button>
            </div>
            <div className="card-body">
              {notifications.length > 0 ? (
                <div className="notifications-list">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    >
                      <div className="notification-content">
                        <p className="notification-message">{notification.message}</p>
                        <p className="notification-date">
                          {new Date(notification.date).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      {!notification.read && <span className="notification-dot"></span>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No notifications</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/equipment" className="action-card">
              <FaTractor className="action-icon" />
              <h3>Browse Equipment</h3>
              <p>Explore our catalogue</p>
            </Link>
            <Link to="/finance" className="action-card">
              <FaChartLine className="action-icon" />
              <h3>EMI Calculator</h3>
              <p>Calculate financing options</p>
            </Link>
            <Link to="/farmer/orders" className="action-card">
              <FaShoppingCart className="action-icon" />
              <h3>My Orders</h3>
              <p>Track your purchases</p>
            </Link>
            <Link to="/reviews" className="action-card">
              <FaBell className="action-icon" />
              <h3>Write Review</h3>
              <p>Share your experience</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;

// Made with Bob
