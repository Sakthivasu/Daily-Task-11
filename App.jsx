  import React, { useState } from 'react';
  import Navbar from './components/Navbar';
  import FilterBar from './components/FilterBar';
  import KPICards from './components/KPICards';
  import RevenueLineChart from './components/RevenueLineChart';
  import CategoryBarChart from './components/CategoryBarChart';
  import CategoryPieChart from './components/CategoryPieChart';
  import RegionBarChart from './components/RegionBarChart';
  import TopProductsTable from './components/TopProductsTable';

  export default function App() {
    const [filters, setFilters] = useState({
      from: '',
      to: '',
      category: ''
    });

    return (
      <div>
        <Navbar />
        <div className="dashboard-container">
          <FilterBar filters={filters} setFilters={setFilters} />
          
          <KPICards params={filters} />
          
          <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
            <RevenueLineChart params={filters} />
          </div>
          
          <div className="charts-grid-half">
            <CategoryBarChart params={filters} />
            <CategoryPieChart params={filters} />
          </div>
          
          <div className="charts-grid-half" style={{ marginTop: '1.5rem' }}>
            <RegionBarChart params={filters} />
            <TopProductsTable params={filters} />
          </div>
        </div>
      </div>
    );
  }