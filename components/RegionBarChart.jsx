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

const COLORS = ['#cd7e7e', '#77d1cb', '#c192dc', '#dbb376'];

export default function RegionBarChart({ params }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get('/sales/by-region', { params })
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [params]);

  return (
    <div className="chart-card">
      <h3>Performance by Region</h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="region" type="category" />
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