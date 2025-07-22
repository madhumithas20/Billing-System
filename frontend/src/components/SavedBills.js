import React, { useEffect, useState } from 'react';
import './SavedBills.css';

const SavedBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/bills`);
      const data = await res.json();
      setBills(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch bills:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bill?')) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/bills/${id}`, { method: 'DELETE' });
      if (res.ok) setBills(prev => prev.filter(bill => bill._id !== id));
      else alert('Failed to delete bill');
    } catch (err) {
      console.error('Error deleting bill:', err);
    }
  };
const handlePrint = (bill) => {
  const printWindow = window.open('', '_blank');
  const html = `
    <html>
      <head>
        <title>Print Bill</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h2 {
            text-align: center;
            margin-bottom: 5px;
          }
          .address {
            text-align: center;
            margin-bottom: 20px;
            font-size: 14px;
          }
          p {
            margin: 5px 0;
            font-size: 16px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
          }
          .total {
            text-align: right;
            margin-top: 15px;
            font-size: 18px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h2>Mahalakshmi Store</h2>
        <div class="address">10/4, Nellithurai street, Kottur malayandi pattinam<br/>Contact: +91 9976182052</div>

        <p><strong>Name:</strong> ${bill.customerName}</p>
        <p><strong>Date:</strong> ${bill.date}</p>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${bill.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
                <td>₹${item.total}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="total">Total: ₹${bill.totalAmount}</div>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

  const getMonth = (dateStr) => new Date(dateStr).getMonth() + 1;
  const getYear = (dateStr) => new Date(dateStr).getFullYear();

  const filteredBills = bills
    .filter(bill =>
      bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.date.includes(searchTerm)
    )
    .filter(bill =>
      (!monthFilter || getMonth(bill.date) === parseInt(monthFilter)) &&
      (!yearFilter || getYear(bill.date) === parseInt(yearFilter))
    )
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const years = [...new Set(bills.map(bill => getYear(bill.date)))];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  if (loading) return <p>Loading saved bills...</p>;

  return (
    <div className="saved-bills-container">
      <h2>Saved Bills</h2>

      {/* Search & Filter UI */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or date (YYYY-MM-DD)"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
          <option value="">All Months</option>
          {months.map(month => (
            <option key={month} value={month}>
              {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>

        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
          <option value="">All Years</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
          Sort: {sortOrder === 'asc' ? 'Oldest → Newest' : 'Newest → Oldest'}
        </button>
      </div>

      {filteredBills.length === 0 ? (
        <p>No bills found.</p>
      ) : (
        filteredBills.map((bill) => (
          <div key={bill._id} className="bill-card">
            <p><strong>Customer:</strong> {bill.customerName}</p>
            <p><strong>Date:</strong> {bill.date}</p>
            <table className="bill-items-table">
              <thead>
                <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
              </thead>
              <tbody>
                {bill.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price}</td>
                    <td>₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="bill-total"><strong>Total:</strong> ₹{bill.totalAmount}</p>
            <div className="bill-actions">
              <button className="print-btn" onClick={() => handlePrint(bill)}>Print</button>
              <button className="delete-btn" onClick={() => handleDelete(bill._id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedBills;
