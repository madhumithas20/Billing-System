// src/App.js
import React, { useState, useEffect } from 'react';
import ProductSearch from './components/ProductSearch';
import BillTable from './components/BillTable';
import PrintButton from './components/PrintButton';
import './styles.css';
import './App.css';
import { Link } from 'react-router-dom';

function App() {
  const [billItems, setBillItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [billDate, setBillDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    document.title = "Mahalakshmi Store Bill"; // ✅ Set page title to avoid "React App" in print
  }, []);

  const handleAddProduct = (product) => {
    const existingIndex = billItems.findIndex((item) => item.name === product.name);
    const newItem = {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      total: product.quantity * product.price,
    };

    if (existingIndex !== -1) {
      const updated = [...billItems];
      updated[existingIndex] = newItem;
      setBillItems(updated);
    } else {
      setBillItems([...billItems, newItem]);
    }
  };

  const handleQuantityChange = (index, qty) => {
    const updated = [...billItems];
    updated[index].quantity = qty;
    updated[index].total = qty * updated[index].price;
    setBillItems(updated);
  };

  const handleClear = () => {
    setBillItems([]);
    setCustomerName('');
    setBillDate(new Date().toISOString().split('T')[0]);
  };

  const handleSaveBill = async () => {
    const totalAmount = billItems.reduce((sum, item) => sum + item.total, 0);
    const bill = {
      customerName,
      date: billDate,
      items: billItems,
      totalAmount,
    };

    try {
      const res = await fetch('http://localhost:5000/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bill),
      });

      if (res.ok) {
        alert('Bill saved successfully!');
        handleClear();
      } else {
        alert('Bill cannot be saved!');
      }
    } catch (err) {
      alert('Error occurred while saving!');
    }
  };

  const totalAmount = billItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="app-container">
      <h2><strong>Mahalakshmi Store</strong></h2>
      <p className="shop-address">10/4, Nellithurai street, Kottur malayandi pattinam</p>
      <p className="shop-address">Contact: +91 9976182052</p>

      {/* ⬇ Gap between address and inputs */}
      <div className="input-group non-print customer-input-group">
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          type="date"
          value={billDate}
          onChange={(e) => setBillDate(e.target.value)}
        />
      </div>

      <div className="non-print">
        <ProductSearch onAddProduct={handleAddProduct} />
      </div>

      <div className="print-area">
        <div className="bill-header">
          <p><strong>Name:</strong> {customerName}</p>
          <p><strong>Date:</strong> {billDate}</p>
        </div>

        <BillTable items={billItems} onQuantityChange={handleQuantityChange} />

        <div className="total-row print-only">
          <p><strong>Grand Total:</strong> ₹{totalAmount}</p>
        </div>

        <div className="total-row non-print">
          <p><strong>Grand Total:</strong> ₹{totalAmount}</p>
        </div>
      </div>

      <div className="button-group non-print">
       <Link to="/saved-bills">
        <button>Saved Bills</button>
       </Link>
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleSaveBill}>Save</button>
       <PrintButton />
      </div>

    </div>
  );
}

export default App;
