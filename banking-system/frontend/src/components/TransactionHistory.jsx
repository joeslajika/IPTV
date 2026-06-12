import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/TransactionHistory.css';

function TransactionHistory({ accountId, token }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [page, setPage] = useState(0);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadTransactions();
    loadAnalytics();
  }, [filterType, filterStatus, page]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      let url = `http://localhost:5000/api/transactions/${accountId}?limit=20&skip=${page * 20}`;
      
      if (filterStatus !== 'all') {
        url = `http://localhost:5000/api/transactions/${accountId}/status/${filterStatus}`;
      } else if (filterType !== 'all') {
        url = `http://localhost:5000/api/transactions/${accountId}/type/${filterType}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Load transactions error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/transactions/${accountId}/summary/analytics?days=30`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalytics(response.data.summary);
    } catch (error) {
      console.error('Load analytics error:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      loadTransactions();
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/transactions/${accountId}/search/query?query=${searchQuery}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/transactions/${accountId}/export/data?format=${format}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: format === 'csv' ? 'blob' : 'json'
        }
      );

      if (format === 'csv') {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `transactions-${new Date().toISOString()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      completed: '#4caf50',
      pending: '#ff9800',
      awaiting_approval: '#2196f3',
      failed: '#f44336',
      processing: '#9c27b0'
    };
    return colors[status] || '#666';
  };

  return (
    <div className="transaction-history">
      <h2>📊 Transaction History & Analytics</h2>

      {/* Analytics Section */}
      {analytics && (
        <div className="analytics-section">
          <div className="analytics-card">
            <h4>Total Transactions</h4>
            <p className="metric">{analytics.totalTransactions}</p>
          </div>
          <div className="analytics-card">
            <h4>Total Sent</h4>
            <p className="metric">{analytics.totalSent.toLocaleString()}</p>
          </div>
          <div className="analytics-card">
            <h4>Total Received</h4>
            <p className="metric">{analytics.totalReceived.toLocaleString()}</p>
          </div>
          <div className="analytics-card">
            <h4>Completed</h4>
            <p className="metric success">{analytics.completedCount}</p>
          </div>
          <div className="analytics-card">
            <h4>Pending</h4>
            <p className="metric warning">{analytics.pendingCount}</p>
          </div>
          <div className="analytics-card">
            <h4>Failed</h4>
            <p className="metric error">{analytics.failedCount}</p>
          </div>
        </div>
      )}

      {/* Filter & Search Section */}
      <div className="filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>🔍 Search</button>
        </div>

        <div className="filters">
          <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(0); }}>
            <option value="all">All Types</option>
            <option value="transfer">Transfer</option>
            <option value="payment">Payment</option>
            <option value="crypto_transfer">Crypto</option>
            <option value="card_payment">Card Payment</option>
          </select>

          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }}>
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="awaiting_approval">Awaiting Approval</option>
            <option value="failed">Failed</option>
          </select>

          <button onClick={() => handleExport('json')}>📥 JSON</button>
          <button onClick={() => handleExport('csv')}>📊 CSV</button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="transactions-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>From/To</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="loading">Loading...</td>
              </tr>
            ) : transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx.transactionId} className={`status-${tx.status}`}>
                  <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td>{tx.type}</td>
                  <td className="identifier">{tx.toAccount || tx.fromAccount}</td>
                  <td className="amount">
                    {tx.amount} {tx.currency}
                  </td>
                  <td>
                    <span className="badge" style={{ backgroundColor: getStatusBadge(tx.status) }}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="time">{tx.processingTime || 'N/A'}</td>
                  <td>
                    <button 
                      className="detail-btn"
                      onClick={() => setSelectedTransaction(tx)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>← Previous</button>
        <span>Page {page + 1}</span>
        <button onClick={() => setPage(page + 1)}>Next →</button>
      </div>

      {/* Detail Modal */}
      {selectedTransaction && (
        <div className="modal-overlay" onClick={() => setSelectedTransaction(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Transaction Details</h3>
            <button className="close-btn" onClick={() => setSelectedTransaction(null)}>✕</button>
            
            <div className="detail-grid">
              <div><strong>ID:</strong> {selectedTransaction.transactionId}</div>
              <div><strong>Type:</strong> {selectedTransaction.type}</div>
              <div><strong>Status:</strong> {selectedTransaction.status}</div>
              <div><strong>From:</strong> {selectedTransaction.fromAccount}</div>
              <div><strong>To:</strong> {selectedTransaction.toAccount}</div>
              <div><strong>Amount:</strong> {selectedTransaction.amount} {selectedTransaction.currency}</div>
              {selectedTransaction.convertedAmount && (
                <>
                  <div><strong>Converted:</strong> {selectedTransaction.convertedAmount} {selectedTransaction.convertedCurrency}</div>
                  <div><strong>Rate:</strong> {selectedTransaction.exchangeRate}</div>
                </>
              )}
              <div><strong>Processing Time:</strong> {selectedTransaction.processingTime}</div>
              <div><strong>Created:</strong> {new Date(selectedTransaction.createdAt).toLocaleString()}</div>
              {selectedTransaction.completedAt && (
                <div><strong>Completed:</strong> {new Date(selectedTransaction.completedAt).toLocaleString()}</div>
              )}
            </div>

            <button className="receipt-btn" onClick={() => window.open(`/api/transactions/${selectedTransaction.transactionId}/receipt`)}>
              🧾 Download Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionHistory;
