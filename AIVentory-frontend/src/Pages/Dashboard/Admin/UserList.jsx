import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    
    setTimeout(() => {
      setUsers([
        {
          id: 1,
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@demo.com',
          role: 'admin',
          phone: '+90 555 123 4567',
          isActive: true,
          lastLoginAt: '2024-01-15 14:30',
          createdAt: '2024-01-01'
        },
        {
          id: 2,
          firstName: 'Ayşe',
          lastName: 'Kaya',
          email: 'manager@demo.com',
          role: 'manager',
          phone: '+90 555 234 5678',
          isActive: true,
          lastLoginAt: '2024-01-15 10:15',
          createdAt: '2024-01-05'
        },
        {
          id: 3,
          firstName: 'Mehmet',
          lastName: 'Yılmaz',
          email: 'employee@demo.com',
          role: 'employee',
          phone: '+90 555 345 6789',
          isActive: true,
          lastLoginAt: '2024-01-14 16:45',
          createdAt: '2024-01-10'
        },
        {
          id: 4,
          firstName: 'Fatma',
          lastName: 'Demir',
          email: 'kasiyer@demo.com',
          role: 'employee',
          phone: '+90 555 456 7890',
          isActive: true,
          lastLoginAt: '2024-01-15 09:20',
          createdAt: '2024-01-12'
        },
        {
          id: 5,
          firstName: 'Ali',
          lastName: 'Özkan',
          email: 'inactive@demo.com',
          role: 'employee',
          phone: '+90 555 567 8901',
          isActive: false,
          lastLoginAt: null,
          createdAt: '2024-01-08'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

 
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === '' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

 
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleDeleteUser = (userId) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive }
        : user
    ));
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'badge-danger',
      manager: 'badge-main',
      employee: 'badge-success'
    };
    return badges[role] || 'badge-main';
  };

  const getRoleText = (role) => {
    const roles = {
      admin: 'Yönetici',
      manager: 'Müdür',
      employee: 'Çalışan'
    };
    return roles[role] || role;
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="loading-overlay">
          <div className="loading-spinner lg"></div>
          <p>Kullanıcılar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-dark fw-bold mb-1">Kullanıcı Yönetimi</h1>
          <p className="text-gray mb-0">Sistem kullanıcılarını görüntüleyin ve yönetin</p>
        </div>
        <Link to="/admin/users/add" className="btn btn-main">
          <i className="fas fa-plus me-2"></i>
          Yeni Kullanıcı
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Toplam Kullanıcı</span>
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
          </div>
          <div className="stat-value">{users.length}</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>
            +2 bu ay
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <span className="stat-title">Aktif Kullanıcı</span>
            <div className="stat-icon success">
              <i className="fas fa-user-check"></i>
            </div>
          </div>
          <div className="stat-value">{users.filter(u => u.isActive).length}</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>
            %95 aktif
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <span className="stat-title">Yöneticiler</span>
            <div className="stat-icon warning">
              <i className="fas fa-user-tie"></i>
            </div>
          </div>
          <div className="stat-value">{users.filter(u => u.role === 'admin').length}</div>
          <div className="stat-change neutral">
            <i className="fas fa-minus"></i>
            Değişim yok
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Çalışanlar</span>
            <div className="stat-icon">
              <i className="fas fa-user"></i>
            </div>
          </div>
          <div className="stat-value">{users.filter(u => u.role === 'employee').length}</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>
            +1 bu hafta
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="position-relative">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Kullanıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">Tüm Roller</option>
                <option value="admin">Yönetici</option>
                <option value="manager">Müdür</option>
                <option value="employee">Çalışan</option>
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-outline-main w-100">
                <i className="fas fa-filter me-2"></i>
                Filtrele
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="table-custom">
          <thead>
            <tr>
              <th>Kullanıcı</th>
              <th>E-posta</th>
              <th>Rol</th>
              <th>Telefon</th>
              <th>Son Giriş</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    <div className={`user-avatar ${user.role}`}>
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <div>
                      <div className="fw-bold text-dark">
                        {user.firstName} {user.lastName}
                      </div>
                      <small className="text-gray">ID: {user.id}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-dark">{user.email}</span>
                </td>
                <td>
                  <span className={`badge ${getRoleBadge(user.role)}`}>
                    {getRoleText(user.role)}
                  </span>
                </td>
                <td>
                  <span className="text-gray">{user.phone}</span>
                </td>
                <td>
                  {user.lastLoginAt ? (
                    <div>
                      <div className="text-dark">{user.lastLoginAt.split(' ')[0]}</div>
                      <small className="text-gray">{user.lastLoginAt.split(' ')[1]}</small>
                    </div>
                  ) : (
                    <span className="text-gray">Hiç giriş yapmadı</span>
                  )}
                </td>
                <td>
                  <span 
                    className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleUserStatus(user.id)}
                  >
                    {user.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Link 
                      to={`/admin/users/edit/${user.id}`}
                      className="btn btn-sm btn-outline-main"
                      title="Düzenle"
                    >
                      <i className="fas fa-edit"></i>
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Sil"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <div className="page-item">
            <button 
              className="page-link"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
          </div>
          
          {[...Array(totalPages)].map((_, index) => (
            <div key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button 
                className="page-link"
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            </div>
          ))}
          
          <div className="page-item">
            <button 
              className="page-link"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;