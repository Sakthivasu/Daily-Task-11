import React, { useState, useEffect } from 'react';
import API from '../api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#d76bcc', '#84a7e0', '#c8a974', '#b66b6b', '#6ab589'];

export default function CategoryPieChart({ params }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get('/sales/by-category', { params })
      .then(res => {
        // Ensure revenue is a valid number so the pie slices can calculate properly
        const formattedData = res.data.map(item => ({
          ...item,
          revenue: Number(item.revenue) || 0 
        }));
        setData(formattedData);
      })
      .catch(err => console.error(err));
  }, [params]);

  return (
    <div className="chart-card" style={{ width: '100%', minWidth: '300px' }}>
      <h3>Revenue Breakdown (Pie)</h3>
      {/* Added a min-height check to prevent ResponsiveContainer from collapsing to 0 height */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie 
            data={data} 
            dataKey="revenue" 
            nameKey="category" 
            cx="50%" 
            cy="50%" 
            outerRadius={80} 
            fill="#d0cfe8"
            label={(entry) => `${entry.category}: $${entry.revenue}`} 
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}