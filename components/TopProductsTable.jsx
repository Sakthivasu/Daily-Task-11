  import React, { useState, useEffect } from 'react';
  import API from '../api';

  export default function TopProductsTable({ params }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
      API.get('/sales/top-products', { params })
        .then(res => setProducts(res.data))
        .catch(err => console.error(err));
    }, [params]);

    return (
      <div className="chart-card">
        <h3>Top 5 Products Leaderboard</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Product</th>
                <th>Category</th>
                <th>Units Sold</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod, idx) => (
                <tr key={idx}>
                  <td><strong>#{idx + 1}</strong></td>
                  <td>{prod.product}</td>
                  <td>{prod.category}</td>
                  <td>{prod.units_sold}</td>
                  <td>${Number(prod.revenue).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }