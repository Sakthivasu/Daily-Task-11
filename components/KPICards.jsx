import React, { useState, useEffect } from 'react';
import API from '../api';

export default function KPICards({ params }) {
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    API.get('/kpis', { params })
      .then(res => setKpis(res.data))
      .catch(err => console.error(err));
  }, [params]);

  if (!kpis) return <div>Loading Summary Cards...</div>;

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-title">Total Revenue</div>
        <div className="kpi-value">${Number(kpis.total_revenue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-title">Total Orders</div>
        <div className="kpi-value">{kpis.total_orders}</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-title">Avg Order Value</div>
        <div className="kpi-value">${Number(kpis.avg_order_value).toFixed(2)}</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-title">Best Selling Product</div>
        <div className="kpi-value" style={{ fontSize: '1.3rem', paddingTop: '0.4rem' }}>{kpis.best_selling.name}</div>
        <div className="kpi-subtext">{kpis.best_selling.units_sold} units sold</div>
      </div>
    </div>
  );
}