import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../Layouts/MainLayout';
import DashboardLayout from '../Layouts/DashboardLayout';

// Promotion Pages
import Home from '../Pages/Promotion/Home';
import Features from '../Pages/Promotion/Features';
import Pricing from '../Pages/Promotion/Pricing';
import Contact from '../Pages/Promotion/Contact';
import Login from '../Pages/Promotion/Login';
import Register from '../Pages/Promotion/Register';
import ForgotPassword from '../Pages/Promotion/ForgotPassword';

// Dashboard Role Pages
import AdminDashboard from '../Pages/Dashboard/Admin/AdminDashboard';
import ManagerDashboard from '../Pages/Dashboard/Manager/ManagerDashboard';
import EmployeeDashboard from '../Pages/Dashboard/Employee/EmployeeDashboard';

// === ADMIN SPECIFIC PAGES ===
import AdminProductList from '../Pages/Dashboard/Admin/AdminProductList';
import AdminAddProduct from '../Pages/Dashboard/Admin/AdminAddProduct';
import AdminCategories from '../Pages/Dashboard/Admin/AdminCategories';
import AdminStockOverview from '../Pages/Dashboard/Admin/AdminStockOverview';
import AdminStockMovements from '../Pages/Dashboard/Admin/AdminStockMovements';
import AdminStockPredictions from '../Pages/Dashboard/Admin/AdminStockPredictions';
import AdminStockUpdate from '../Pages/Dashboard/Admin/AdminStockUpdate';
import AdminProductRecognition from '../Pages/Dashboard/Admin/AdminProductRecognition';
import AdminColorAnalysis from '../Pages/Dashboard/Admin/AdminColorAnalysis';
import AdminAIRecommendations from '../Pages/Dashboard/Admin/AdminAIRecommendations';
import AdminUserList from '../Pages/Dashboard/Admin/UserList';
import AdminAddUser from '../Pages/Dashboard/Admin/AddUser';
import AdminSalesReport from '../Pages/Dashboard/Admin/AdminSalesReport';
import AdminStockReport from '../Pages/Dashboard/Admin/AdminStockReport';
import AdminAIReport from '../Pages/Dashboard/Admin/AIReport';
import AdminProfile from '../Pages/Dashboard/Admin/AdminProfile';
import AdminCompanySettings from '../Pages/Dashboard/Admin/CompanySettings';

// === MANAGER SPECIFIC PAGES ===
import ManagerProductList from '../Pages/Dashboard/Manager/ManagerProductList';
import ManagerAddProduct from '../Pages/Dashboard/Manager/ManagerAddProduct';
import ManagerCategories from '../Pages/Dashboard/Manager/ManagerCategories';
import ManagerStockOverview from '../Pages/Dashboard/Manager/ManagerStockOverview';
import ManagerStockMovements from '../Pages/Dashboard/Manager/ManagerStockMovements';
import ManagerStockPredictions from '../Pages/Dashboard/Manager/ManagerStockPredictions';
import ManagerStockUpdate from '../Pages/Dashboard/Manager/ManagerStockUpdate';
import ManagerProductRecognition from '../Pages/Dashboard/Manager/ManagerProductRecognition';
import ManagerColorAnalysis from '../Pages/Dashboard/Manager/ManagerColorAnalysis';
import ManagerAIRecommendations from '../Pages/Dashboard/Manager/ManagerAIRecommendations';
import ManagerSalesReport from '../Pages/Dashboard/Manager/ManagerSalesReport';
import ManagerStockReport from '../Pages/Dashboard/Manager/ManagerStockReport';
import ManagerProfile from '../Pages/Dashboard/Manager/ManagerProfile';

// === EMPLOYEE SPECIFIC PAGES ===
import EmployeeProductList from '../Pages/Dashboard/Employee/EmployeeProductList';
import EmployeeAddProduct from '../Pages/Dashboard/Employee/EmployeeAddProduct';
import EmployeeStockOverview from '../Pages/Dashboard/Employee/EmployeeStockOverview';
import EmployeeStockUpdate from '../Pages/Dashboard/Employee/EmployeeStockUpdate';
import EmployeeProductRecognition from '../Pages/Dashboard/Employee/EmployeeProductRecognition';
import EmployeeColorAnalysis from '../Pages/Dashboard/Employee/EmployeeColorAnalysis';
import EmployeeProfile from '../Pages/Dashboard/Employee/EmployeeProfile';

// Protected Route
import ProtectedRoute from '../Shared/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes with Main Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="features" element={<Features />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Auth Routes (No Layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ========================================= */}
      {/* ADMIN ROUTES */}
      {/* ========================================= */}
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          
          {/* Product Management - Admin */}
          <Route path="products" element={<AdminProductList />} />
          <Route path="products/add" element={<AdminAddProduct />} />
          <Route path="products/edit/:id" element={<AdminAddProduct />} />
          <Route path="categories" element={<AdminCategories />} />
          
          {/* Stock Management - Admin */}
          <Route path="stock" element={<AdminStockOverview />} />
          <Route path="stock/movements" element={<AdminStockMovements />} />
          <Route path="stock/predictions" element={<AdminStockPredictions />} />
          <Route path="stock/update" element={<AdminStockUpdate />} />
          
          {/* AI Features - Admin */}
          <Route path="ai/recognition" element={<AdminProductRecognition />} />
          <Route path="ai/colors" element={<AdminColorAnalysis />} />
          <Route path="ai/recommendations" element={<AdminAIRecommendations />} />
          
          {/* User Management - Admin Only */}
          <Route path="users" element={<AdminUserList />} />
          <Route path="users/add" element={<AdminAddUser />} />
          <Route path="users/edit/:id" element={<AdminAddUser />} />
          
          {/* Reports - Admin */}
          <Route path="reports/sales" element={<AdminSalesReport />} />
          <Route path="reports/stock" element={<AdminStockReport />} />
          <Route path="reports/ai" element={<AdminAIReport />} />
          
          {/* Settings - Admin */}
          <Route path="profile" element={<AdminProfile />} />
          <Route path="settings" element={<AdminCompanySettings />} />
        </Route>
      </Route>

      {/* ========================================= */}
      {/* MANAGER ROUTES */}
      {/* ========================================= */}
      <Route element={<ProtectedRoute requiredRole="manager" />}>
        <Route path="/manager" element={<DashboardLayout />}>
          <Route index element={<ManagerDashboard />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          
          {/* Product Management - Manager */}
          <Route path="products" element={<ManagerProductList />} />
          <Route path="products/add" element={<ManagerAddProduct />} />
          <Route path="products/edit/:id" element={<ManagerAddProduct />} />
          <Route path="categories" element={<ManagerCategories />} />
          
          {/* Stock Management - Manager */}
          <Route path="stock" element={<ManagerStockOverview />} />
          <Route path="stock/movements" element={<ManagerStockMovements />} />
          <Route path="stock/predictions" element={<ManagerStockPredictions />} />
          <Route path="stock/update" element={<ManagerStockUpdate />} />
          
          {/* AI Features - Manager */}
          <Route path="ai/recognition" element={<ManagerProductRecognition />} />
          <Route path="ai/colors" element={<ManagerColorAnalysis />} />
          <Route path="ai/recommendations" element={<ManagerAIRecommendations />} />
          
          {/* Reports - Manager */}
          <Route path="reports/sales" element={<ManagerSalesReport />} />
          <Route path="reports/stock" element={<ManagerStockReport />} />
          
          {/* Profile - Manager */}
          <Route path="profile" element={<ManagerProfile />} />
        </Route>
      </Route>

      {/* ========================================= */}
      {/* EMPLOYEE ROUTES */}
      {/* ========================================= */}
      <Route element={<ProtectedRoute requiredRole="employee" />}>
        <Route path="/employee" element={<DashboardLayout />}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />
          
          {/* Product Management - Employee (Limited) */}
          <Route path="products" element={<EmployeeProductList />} />
          <Route path="products/add" element={<EmployeeAddProduct />} />
          
          {/* Stock Management - Employee (Limited) */}
          <Route path="stock" element={<EmployeeStockOverview />} />
          <Route path="stock/update" element={<EmployeeStockUpdate />} />

          {/* AI Features - Employee */}
          <Route path="ai/recognition" element={<EmployeeProductRecognition />} />
          <Route path="ai/colors" element={<EmployeeColorAnalysis />} />
          
          {/* Profile - Employee */}
          <Route path="profile" element={<EmployeeProfile />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// 404 Component
const NotFound = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light-custom">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-main">404</h1>
        <p className="fs-3 text-gray">Sayfa bulunamadı</p>
        <a href="/" className="btn btn-main">
          <i className="fas fa-home me-2"></i>
          Ana Sayfaya Dön
        </a>
      </div>
    </div>
  );
};

export default AppRoutes;