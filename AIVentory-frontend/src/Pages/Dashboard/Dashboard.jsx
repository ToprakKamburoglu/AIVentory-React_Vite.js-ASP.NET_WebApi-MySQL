import React from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import AdminDashboard from './Admin/AdminDashboard.jsx';
import ManagerDashboard from './Manager/ManagerDashboard.jsx';
import EmployeeDashboard from './Employee/EmployeeDashboard.jsx';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      case 'employee':
        return <EmployeeDashboard />;
      default:
        return <div className="alert alert-danger">Yetkiniz bulunmamaktadır.</div>;
    }
  };

  return (
    <>
      {renderDashboard()}
    </>
  );
};

export default Dashboard;