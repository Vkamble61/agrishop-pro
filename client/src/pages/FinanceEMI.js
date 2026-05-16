import React, { useState } from 'react';
import { FaCalculator, FaRupeeSign, FaCalendarAlt, FaPercent, FaChartLine } from 'react-icons/fa';
import './FinanceEMI.css';

const FinanceEMI = () => {
  const [calculatorInputs, setCalculatorInputs] = useState({
    amount: '',
    downPayment: '',
    interestRate: '12',
    tenure: '12'
  });

  const [emiResult, setEmiResult] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Predefined loan schemes
  const loanSchemes = [
    {
      id: 1,
      name: 'Zero Interest - 3 Months',
      interestRate: 0,
      tenure: 3,
      minAmount: 50000,
      maxAmount: 200000,
      description: 'No interest for first 3 months',
      features: ['No processing fee', 'Quick approval', 'Flexible repayment']
    },
    {
      id: 2,
      name: 'Low Interest - 6 Months',
      interestRate: 8,
      tenure: 6,
      minAmount: 100000,
      maxAmount: 500000,
      description: 'Low interest rate for 6 months',
      features: ['Minimal documentation', 'Fast processing', 'No hidden charges']
    },
    {
      id: 3,
      name: 'Standard - 12 Months',
      interestRate: 12,
      tenure: 12,
      minAmount: 200000,
      maxAmount: 1000000,
      description: 'Standard interest rate for 1 year',
      features: ['Flexible tenure', 'Easy EMI', 'Insurance included']
    },
    {
      id: 4,
      name: 'Extended - 24 Months',
      interestRate: 14,
      tenure: 24,
      minAmount: 500000,
      maxAmount: 2000000,
      description: 'Extended tenure with competitive rates',
      features: ['Lower monthly EMI', 'Grace period available', 'Prepayment allowed']
    },
    {
      id: 5,
      name: 'Premium - 36 Months',
      interestRate: 15,
      tenure: 36,
      minAmount: 1000000,
      maxAmount: 5000000,
      description: 'Premium scheme for high-value equipment',
      features: ['Lowest EMI', 'Premium support', 'Flexible terms']
    }
  ];

  const calculateEMI = () => {
    const principal = parseFloat(calculatorInputs.amount) - parseFloat(calculatorInputs.downPayment || 0);
    const rate = parseFloat(calculatorInputs.interestRate) / 12 / 100;
    const tenure = parseInt(calculatorInputs.tenure);

    if (principal <= 0 || tenure <= 0) {
      alert('Please enter valid values');
      return;
    }

    let emi;
    let totalAmount;
    let totalInterest;

    if (rate === 0) {
      // Zero interest case
      emi = principal / tenure;
      totalAmount = principal;
      totalInterest = 0;
    } else {
      // Standard EMI calculation
      emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
      totalAmount = emi * tenure;
      totalInterest = totalAmount - principal;
    }

    setEmiResult({
      monthlyEMI: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      principal: Math.round(principal),
      downPayment: parseFloat(calculatorInputs.downPayment || 0)
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCalculatorInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyScheme = (scheme) => {
    setSelectedScheme(scheme);
    setCalculatorInputs(prev => ({
      ...prev,
      interestRate: scheme.interestRate.toString(),
      tenure: scheme.tenure.toString()
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="finance-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <FaCalculator /> Finance & EMI Calculator
            </h1>
            <p className="page-subtitle">
              Calculate your monthly EMI and explore our flexible financing options
            </p>
          </div>
        </div>

        <div className="finance-content">
          {/* EMI Calculator */}
          <div className="calculator-section">
            <div className="section-card">
              <h2 className="section-title">
                <FaCalculator /> EMI Calculator
              </h2>

              <div className="calculator-form">
                <div className="form-group">
                  <label>
                    <FaRupeeSign /> Equipment Price
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={calculatorInputs.amount}
                    onChange={handleInputChange}
                    placeholder="Enter equipment price"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaRupeeSign /> Down Payment (Optional)
                  </label>
                  <input
                    type="number"
                    name="downPayment"
                    value={calculatorInputs.downPayment}
                    onChange={handleInputChange}
                    placeholder="Enter down payment"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaPercent /> Interest Rate (% per annum)
                  </label>
                  <input
                    type="number"
                    name="interestRate"
                    value={calculatorInputs.interestRate}
                    onChange={handleInputChange}
                    placeholder="Enter interest rate"
                    className="form-input"
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaCalendarAlt /> Tenure (Months)
                  </label>
                  <input
                    type="number"
                    name="tenure"
                    value={calculatorInputs.tenure}
                    onChange={handleInputChange}
                    placeholder="Enter tenure in months"
                    className="form-input"
                  />
                </div>

                <button onClick={calculateEMI} className="btn btn-primary btn-lg">
                  <FaChartLine /> Calculate EMI
                </button>
              </div>

              {/* EMI Result */}
              {emiResult && (
                <div className="emi-result">
                  <h3 className="result-title">Your EMI Breakdown</h3>
                  
                  <div className="result-grid">
                    <div className="result-card primary">
                      <div className="result-label">Monthly EMI</div>
                      <div className="result-value">{formatCurrency(emiResult.monthlyEMI)}</div>
                    </div>

                    <div className="result-card">
                      <div className="result-label">Principal Amount</div>
                      <div className="result-value">{formatCurrency(emiResult.principal)}</div>
                    </div>

                    <div className="result-card">
                      <div className="result-label">Total Interest</div>
                      <div className="result-value">{formatCurrency(emiResult.totalInterest)}</div>
                    </div>

                    <div className="result-card">
                      <div className="result-label">Total Amount</div>
                      <div className="result-value">{formatCurrency(emiResult.totalAmount)}</div>
                    </div>
                  </div>

                  {emiResult.downPayment > 0 && (
                    <div className="down-payment-info">
                      <p>Down Payment: {formatCurrency(emiResult.downPayment)}</p>
                      <p>Total Cost: {formatCurrency(emiResult.totalAmount + emiResult.downPayment)}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Loan Schemes */}
          <div className="schemes-section">
            <h2 className="section-title">Available Loan Schemes</h2>
            <p className="section-subtitle">Choose from our flexible financing options</p>

            <div className="schemes-grid">
              {loanSchemes.map(scheme => (
                <div 
                  key={scheme.id} 
                  className={`scheme-card ${selectedScheme?.id === scheme.id ? 'selected' : ''}`}
                >
                  <div className="scheme-header">
                    <h3 className="scheme-name">{scheme.name}</h3>
                    <div className="scheme-rate">
                      {scheme.interestRate === 0 ? 'Zero Interest' : `${scheme.interestRate}% p.a.`}
                    </div>
                  </div>

                  <p className="scheme-description">{scheme.description}</p>

                  <div className="scheme-details">
                    <div className="scheme-detail">
                      <span className="detail-label">Tenure:</span>
                      <span className="detail-value">{scheme.tenure} months</span>
                    </div>
                    <div className="scheme-detail">
                      <span className="detail-label">Amount Range:</span>
                      <span className="detail-value">
                        {formatCurrency(scheme.minAmount)} - {formatCurrency(scheme.maxAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="scheme-features">
                    <h4>Features:</h4>
                    <ul>
                      {scheme.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    onClick={() => applyScheme(scheme)}
                    className="btn btn-outline btn-block"
                  >
                    Apply This Scheme
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Information Section */}
          <div className="info-section">
            <div className="info-card">
              <h3>How to Apply for Finance</h3>
              <ol>
                <li>Select your desired equipment from our catalogue</li>
                <li>Choose a suitable loan scheme</li>
                <li>Calculate your EMI using our calculator</li>
                <li>Submit required documents (ID proof, address proof, income proof)</li>
                <li>Get instant approval and take your equipment home</li>
              </ol>
            </div>

            <div className="info-card">
              <h3>Required Documents</h3>
              <ul>
                <li>Aadhaar Card / PAN Card</li>
                <li>Address Proof (Electricity Bill / Ration Card)</li>
                <li>Income Proof (Bank Statement / ITR)</li>
                <li>Land Ownership Documents</li>
                <li>2 Passport Size Photographs</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>Why Choose Our Financing?</h3>
              <ul>
                <li>Quick approval within 24 hours</li>
                <li>Minimal documentation required</li>
                <li>Flexible repayment options</li>
                <li>No hidden charges</li>
                <li>Dedicated support team</li>
                <li>Special schemes for farmers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceEMI;

// Made with Bob
