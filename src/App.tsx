import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DriverManagement from './components/DriverManagement';
import VehicleManagement from './components/VehicleManagement';
import ExpenseManagement from './components/ExpenseManagement';
import PaymentManagement from './components/PaymentManagement';
import ReportsManagement from './components/ReportsManagement';
import ContractManagement from './components/ContractManagement';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'drivers':
        return <DriverManagement />;
      case 'vehicles':
        return <VehicleManagement />;
      case 'expenses':
        return <ExpenseManagement />;
      case 'payments':
        return <PaymentManagement />;
      case 'reports':
        return <ReportsManagement />;
      case 'contracts':
        return <ContractManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;