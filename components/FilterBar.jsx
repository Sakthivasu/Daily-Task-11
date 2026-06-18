import React, { useState, useEffect } from 'react';
import API from '../api';

export default function FilterBar({ filters, setFilters }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>From Date</label>
        <input type="date" name="from" value={filters.from} onChange={handleChange} />
      </div>
      <div className="filter-group">
        <label>To Date</label>
        <input type="date" name="to" value={filters.to} onChange={handleChange} />
      </div>
      <div className="filter-group">
        <label>Category</label>
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}