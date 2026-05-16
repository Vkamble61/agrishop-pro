import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaTractor, FaHandshake, FaTools, FaUsers, FaStar, FaShieldAlt, FaChartLine, FaLeaf } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <FaShieldAlt />,
      title: t('features.quality.title'),
      description: t('features.quality.desc')
    },
    {
      icon: <FaChartLine />,
      title: t('features.finance.title'),
      description: t('features.finance.desc')
    },
    {
      icon: <FaTools />,
      title: t('features.service.title'),
      description: t('features.service.desc')
    },
    {
      icon: <FaUsers />,
      title: t('features.community.title'),
      description: t('features.community.desc')
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Ramesh Kumar",
      village: "Village Rampur",
      rating: 5,
      text: "Best quality tractors and excellent service. The EMI option helped me buy equipment I couldn't afford upfront. Highly recommended!",
      image: "👨‍🌾"
    },
    {
      id: 2,
      name: "Suresh Patel",
      village: "Village Khandwa",
      rating: 5,
      text: "Trusted shop for 3 generations. My grandfather bought from them, now I do too. They understand farmers' needs perfectly.",
      image: "👨‍🌾"
    },
    {
      id: 3,
      name: "Vijay Singh",
      village: "Village Madhoganj",
      rating: 5,
      text: "Professional service and genuine products. The owner's mechanical engineering background shows in the quality advice they provide.",
      image: "👨‍🌾"
    }
  ];

  const stats = [
    { number: "25+", label: "Years of Service" },
    { number: "500+", label: "Happy Farmers" },
    { number: "50+", label: "Equipment Types" },
    { number: "100%", label: "Trust & Quality" }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title fade-in">
                {t('hero.title')}
              </h1>
              <p className="hero-subtitle fade-in">
                {t('hero.subtitle')}
              </p>
              <p className="hero-tagline fade-in">
                <FaLeaf className="tagline-icon" />
                {t('hero.tagline')}
              </p>
              <div className="hero-buttons fade-in">
                <Link to="/equipment" className="btn btn-primary btn-lg">
                  <FaTractor />
                  {t('hero.cta.browse')}
                </Link>
                <Link to="/farmer/register" className="btn btn-secondary btn-lg">
                  <FaHandshake />
                  {t('hero.cta.register')}
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-image-placeholder">
                <FaTractor className="hero-tractor-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('features.title')}</h2>
            <p className="section-subtitle">
              Decades of experience serving the farming community with dedication and expertise
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-content">
            <div className="trust-text">
              <h2 className="trust-title">Why Farmers Trust Us</h2>
              <div className="trust-points">
                <div className="trust-point">
                  <FaShieldAlt className="trust-icon" />
                  <div>
                    <h4>Mechanical Engineering Expertise</h4>
                    <p>Run by a qualified mechanical engineer who understands every machine inside out</p>
                  </div>
                </div>
                <div className="trust-point">
                  <FaHandshake className="trust-icon" />
                  <div>
                    <h4>Built on Personal Relationships</h4>
                    <p>We know our customers by name, understand their farms, and care about their success</p>
                  </div>
                </div>
                <div className="trust-point">
                  <FaUsers className="trust-icon" />
                  <div>
                    <h4>Community Recommendations</h4>
                    <p>Most of our business comes from word-of-mouth referrals from satisfied farmers</p>
                  </div>
                </div>
                <div className="trust-point">
                  <FaTools className="trust-icon" />
                  <div>
                    <h4>After-Sales Service</h4>
                    <p>We don't just sell equipment - we maintain relationships and provide ongoing support</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="trust-image">
              <div className="trust-image-placeholder">
                <FaHandshake className="trust-handshake-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Farmers Say About Us</h2>
            <p className="section-subtitle">
              Real experiences from real farmers in our community
            </p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">{testimonial.image}</div>
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <p className="testimonial-village">{testimonial.village}</p>
                  </div>
                </div>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="star-icon" />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
          <div className="testimonials-cta">
            <Link to="/reviews" className="btn btn-outline btn-lg">
              View All Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Modernize Your Farm?</h2>
            <p className="cta-text">
              Join hundreds of satisfied farmers who trust us for their agriculture equipment needs
            </p>
            <div className="cta-buttons">
              <Link to="/farmer/register" className="btn btn-secondary btn-lg">
                Register Now
              </Link>
              <Link to="/equipment" className="btn btn-outline btn-lg">
                Browse Equipment
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

// Made with Bob
