import React, { useState, useEffect, useRef } from 'react';
import '../App.css';

function ProductSearch({ onAddProduct }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const quantityRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim() === '') {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products?search=${query}`);
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
  }, [query]);

  const resetForm = () => {
    setQuery('');
    setSuggestions([]);
    setSelectedProduct(null);
    setQuantity(1);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSelect = (product) => {
    setSelectedProduct(product);
    setQuery(product.name);
    setShowSuggestions(false);
    setTimeout(() => {
      quantityRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // If product is not yet selected, auto-select the first suggestion
      if (!selectedProduct && suggestions.length > 0) {
        handleSelect(suggestions[0]);
      } 
    }
  };

  const handleQuantityKeyDown = (e) => {
    if (e.key === 'Enter' && selectedProduct) {
      onAddProduct({ ...selectedProduct, quantity });
      resetForm();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="product-input"
          placeholder="Enter the Product Name"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedProduct(null);
            setShowSuggestions(true);
          }}
          onFocus={() => query && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((product, index) => (
              <li key={index} onClick={() => handleSelect(product)}>
                {product.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedProduct && (
        <select
          ref={quantityRef}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          onKeyDown={handleQuantityKeyDown}
          style={{ marginTop: '10px' }}
        >
          {Array.from({ length: 20 }, (_, i) => i + 1).map((qty) => (
            <option key={qty} value={qty}>
              {qty}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default ProductSearch;
