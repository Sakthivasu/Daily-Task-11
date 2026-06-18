import React, { useState, useEffect } from 'react';
import API from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueLineChart({ params }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get('/sales/monthly', { params })
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [params]);

  return (
    <div className="chart-card">
      <h3>Revenue Over Time</h3>
      <ResponsiveContainer width="100%" height={250}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis domain={[0, 'dataMax + 5000']} />
    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
    <Line
      type="monotone"
      dataKey="revenue"
      stroke="#12ce83"
      strokeWidth={1}
      activeDot={{ r: 4 }}
    />
  </LineChart>
</ResponsiveContainer>
    </div>
  );
}