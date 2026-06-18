import React, { useState, useEffect } from 'react';
import API from '../api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const COLORS = [
  '#9ceca5',
  '#76c9c3',
  '#d47dc9',
  '#be9d6a',
  '#b1b66c'
];

export default function CategoryBarChart({ params }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get('/sales/by-category', { params })
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [params]);

  return (
    <div className="chart-card">
      <h3>Revenue by Category (Bar)</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />

          <Bar dataKey="revenue">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}