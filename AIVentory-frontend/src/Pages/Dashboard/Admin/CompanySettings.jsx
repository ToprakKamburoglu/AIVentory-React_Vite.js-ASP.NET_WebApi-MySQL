import React, { useState } from 'react';

const CompanySettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'Demo Market',
    email: 'demo@aiventory.com',
    phone: '+90 555 123 4567',
    address: 'Demo Mahallesi, Demo Caddesi No:1',
    city: 'İstanbul',
    country: 'Türkiye',
    taxNumber: '1234567890',
    website: 'https://aiventory.com',
    logo: null
  });

  const [systemSettings, setSystemSettings] = useState({
    currency: 'TRY',
    taxRate: 20,
    lowStockThreshold: 10,
    language: 'tr',
    timezone: 'Europe/Istanbul',
    dateFormat: 'DD/MM/YYYY',
    aiEnabled: true,
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: false
  });

  const [subscriptionSettings, setSubscriptionSettings] = useState({
    plan: 'Premium',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    maxUsers: 10,
    maxProducts: 5000,
    storageUsed: 2.3,
    storageLimit: 10
  });

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSystemChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSystemSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Şirket bilgileri başarıyla güncellendi!');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert('Bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Sistem ayarları başarıyla güncellendi!');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert('Bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setLoading(false);
    }
  };

  const getStoragePercentage = () => {
    return (subscriptionSettings.storageUsed / subscriptionSettings.storageLimit) * 100;
  };

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-dark fw-bold mb-1">Şirket Ayarları</h1>
        <p className="text-gray mb-0">Şirket bilgilerini ve sistem ayarlarını yönetin</p>
      </div>

      <div className="row">
        {/* Settings Navigation */}
        <div className="col-lg-3">
          <div className="dashboard-card">
            <div className="card-body p-0">
              <div className="nav flex-column nav-pills">
                <button
                  className={`nav-link text-start ${activeTab === 'general' ? 'active' : ''}`}
                  onClick={() => setActiveTab('general')}
                  style={{ background: activeTab === 'general' ? 'var(--main-color)' : 'transparent', color: activeTab === 'general' ? 'white' : 'var(--dark-text)', border: 'none', borderRadius: '0', padding: '16px 20px' }}
                >
                  <i className="fas fa-building me-3"></i>
                  Genel Bilgiler
                </button>
                <button
                  className={`nav-link text-start ${activeTab === 'system' ? 'active' : ''}`}
                  onClick={() => setActiveTab('system')}
                  style={{ background: activeTab === 'system' ? 'var(--main-color)' : 'transparent', color: activeTab === 'system' ? 'white' : 'var(--dark-text)', border: 'none', borderRadius: '0', padding: '16px 20px' }}
                >
                  <i className="fas fa-cogs me-3"></i>
                  Sistem Ayarları
                </button>
                <button
                  className={`nav-link text-start ${activeTab === 'subscription' ? 'active' : ''}`}
                  onClick={() => setActiveTab('subscription')}
                  style={{ background: activeTab === 'subscription' ? 'var(--main-color)' : 'transparent', color: activeTab === 'subscription' ? 'white' : 'var(--dark-text)', border: 'none', borderRadius: '0', padding: '16px 20px' }}
                >
                  <i className="fas fa-credit-card me-3"></i>
                  Abonelik
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="col-lg-9">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="dashboard-card">
              <div className="card-header">
                <h5 className="card-title">
                  <i className="fas fa-building me-2"></i>
                  Şirket Bilgileri
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleGeneralSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Şirket Adı *</label>
                        <input
                          type="text"
                          name="companyName"
                          className="form-control"
                          value={generalSettings.companyName}
                          onChange={handleGeneralChange}
                          placeholder="Şirket adı"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Vergi Numarası</label>
                        <input
                          type="text"
                          name="taxNumber"
                          className="form-control"
                          value={generalSettings.taxNumber}
                          onChange={handleGeneralChange}
                          placeholder="Vergi numarası"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">E-posta Adresi *</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={generalSettings.email}
                          onChange={handleGeneralChange}
                          placeholder="info@company.com"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Telefon *</label>
                        <input
                          type="tel"
                          name="phone"
                          className="form-control"
                          value={generalSettings.phone}
                          onChange={handleGeneralChange}
                          placeholder="+90 555 123 4567"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Adres</label>
                    <textarea
                      name="address"
                      className="form-control"
                      rows="3"
                      value={generalSettings.address}
                      onChange={handleGeneralChange}
                      placeholder="Şirket adresi"
                    ></textarea>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Şehir</label>
                        <input
                          type="text"
                          name="city"
                          className="form-control"
                          value={generalSettings.city}
                          onChange={handleGeneralChange}
                          placeholder="Şehir"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Ülke</label>
                        <select
                          name="country"
                          className="form-select"
                          value={generalSettings.country}
                          onChange={handleGeneralChange}
                        >
                          <option value="Türkiye">Türkiye</option>
                          <option value="ABD">ABD</option>
                          <option value="Almanya">Almanya</option>
                          <option value="Fransa">Fransa</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Website</label>
                    <input
                      type="url"
                      name="website"
                      className="form-control"
                      value={generalSettings.website}
                      onChange={handleGeneralChange}
                      placeholder="https://www.company.com"
                    />
                  </div>

                  <div className="d-flex gap-3 mt-4">
                    <button
                      type="submit"
                      className="btn btn-main"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="loading-spinner me-2"></div>
                          Kaydediliyor...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Kaydet
                        </>
                      )}
                    </button>
                    <button type="button" className="btn btn-outline-main">
                      <i className="fas fa-undo me-2"></i>
                      Sıfırla
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="dashboard-card">
              <div className="card-header">
                <h5 className="card-title">
                  <i className="fas fa-cogs me-2"></i>
                  Sistem Ayarları
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSystemSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Para Birimi</label>
                        <select
                          name="currency"
                          className="form-select"
                          value={systemSettings.currency}
                          onChange={handleSystemChange}
                        >
                          <option value="TRY">Türk Lirası (₺)</option>
                          <option value="USD">Amerikan Doları ($)</option>
                          <option value="EUR">Euro (€)</option>
                          <option value="GBP">İngiliz Sterlini (£)</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">KDV Oranı (%)</label>
                        <input
                          type="number"
                          name="taxRate"
                          className="form-control"
                          value={systemSettings.taxRate}
                          onChange={handleSystemChange}
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Düşük Stok Eşiği</label>
                        <input
                          type="number"
                          name="lowStockThreshold"
                          className="form-control"
                          value={systemSettings.lowStockThreshold}
                          onChange={handleSystemChange}
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Dil</label>
                        <select
                          name="language"
                          className="form-select"
                          value={systemSettings.language}
                          onChange={handleSystemChange}
                        >
                          <option value="tr">Türkçe</option>
                          <option value="en">English</option>
                          <option value="de">Deutsch</option>
                          <option value="fr">Français</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Saat Dilimi</label>
                        <select
                          name="timezone"
                          className="form-select"
                          value={systemSettings.timezone}
                          onChange={handleSystemChange}
                        >
                          <option value="Europe/Istanbul">Istanbul (GMT+3)</option>
                          <option value="UTC">UTC (GMT+0)</option>
                          <option value="America/New_York">New York (GMT-5)</option>
                          <option value="Europe/London">London (GMT+0)</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Tarih Formatı</label>
                        <select
                          name="dateFormat"
                          className="form-select"
                          value={systemSettings.dateFormat}
                          onChange={handleSystemChange}
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <hr className="my-4" />

                  <h6 className="text-dark fw-bold mb-3">
                    <i className="fas fa-toggle-on me-2"></i>
                    Özellik Ayarları
                  </h6>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-check mb-3">
                        <input
                          type="checkbox"
                          name="aiEnabled"
                          className="form-check-input"
                          checked={systemSettings.aiEnabled}
                          onChange={handleSystemChange}
                          id="aiEnabled"
                        />
                        <label className="form-check-label" htmlFor="aiEnabled">
                          AI Özellikleri Aktif
                        </label>
                      </div>

                      <div className="form-check mb-3">
                        <input
                          type="checkbox"
                          name="notificationsEnabled"
                          className="form-check-input"
                          checked={systemSettings.notificationsEnabled}
                          onChange={handleSystemChange}
                          id="notificationsEnabled"
                        />
                        <label className="form-check-label" htmlFor="notificationsEnabled">
                          Bildirimler Aktif
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-check mb-3">
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          className="form-check-input"
                          checked={systemSettings.emailNotifications}
                          onChange={handleSystemChange}
                          id="emailNotifications"
                        />
                        <label className="form-check-label" htmlFor="emailNotifications">
                          E-posta Bildirimleri
                        </label>
                      </div>

                      <div className="form-check mb-3">
                        <input
                          type="checkbox"
                          name="smsNotifications"
                          className="form-check-input"
                          checked={systemSettings.smsNotifications}
                          onChange={handleSystemChange}
                          id="smsNotifications"
                        />
                        <label className="form-check-label" htmlFor="smsNotifications">
                          SMS Bildirimleri
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-3 mt-4">
                    <button
                      type="submit"
                      className="btn btn-main"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="loading-spinner me-2"></div>
                          Kaydediliyor...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Kaydet
                        </>
                      )}
                    </button>
                    <button type="button" className="btn btn-outline-main">
                      <i className="fas fa-undo me-2"></i>
                      Sıfırla
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Subscription Settings */}
          {activeTab === 'subscription' && (
            <div className="dashboard-card">
              <div className="card-header">
                <h5 className="card-title">
                  <i className="fas fa-credit-card me-2"></i>
                  Abonelik Bilgileri
                </h5>
              </div>
              <div className="card-body">
                {/* Current Plan */}
                <div className="alert alert-success">
                  <i className="fas fa-check-circle alert-icon"></i>
                  <div>
                    <strong>Mevcut Plan: {subscriptionSettings.plan}</strong>
                    <p className="mb-0 mt-2">
                      Aboneliğiniz {subscriptionSettings.endDate} tarihine kadar geçerlidir.
                    </p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="stat-card success">
                      <div className="stat-header">
                        <span className="stat-title">Başlangıç Tarihi</span>
                        <div className="stat-icon success">
                          <i className="fas fa-calendar-plus"></i>
                        </div>
                      </div>
                      <div className="stat-value">{subscriptionSettings.startDate}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="stat-card warning">
                      <div className="stat-header">
                        <span className="stat-title">Bitiş Tarihi</span>
                        <div className="stat-icon warning">
                          <i className="fas fa-calendar-times"></i>
                        </div>
                      </div>
                      <div className="stat-value">{subscriptionSettings.endDate}</div>
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-md-6">
                    <div className="stat-card">
                      <div className="stat-header">
                        <span className="stat-title">Maksimum Kullanıcı</span>
                        <div className="stat-icon">
                          <i className="fas fa-users"></i>
                        </div>
                      </div>
                      <div className="stat-value">{subscriptionSettings.maxUsers}</div>
                      <div className="stat-change positive">
                        <i className="fas fa-arrow-up"></i>
                        5 kullanıcı aktif
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="stat-card">
                      <div className="stat-header">
                        <span className="stat-title">Maksimum Ürün</span>
                        <div className="stat-icon">
                          <i className="fas fa-box"></i>
                        </div>
                      </div>
                      <div className="stat-value">{subscriptionSettings.maxProducts.toLocaleString()}</div>
                      <div className="stat-change positive">
                        <i className="fas fa-arrow-up"></i>
                        147 ürün kayıtlı
                      </div>
                    </div>
                  </div>
                </div>

                {/* Storage Usage */}
                <div className="mt-4">
                  <h6 className="text-dark fw-bold mb-3">
                    <i className="fas fa-hdd me-2"></i>
                    Depolama Kullanımı
                  </h6>
                  <div className="dashboard-card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-dark fw-bold">
                          {subscriptionSettings.storageUsed} GB / {subscriptionSettings.storageLimit} GB
                        </span>
                        <span className="text-gray">
                          {getStoragePercentage().toFixed(1)}% kullanılıyor
                        </span>
                      </div>
                      <div className="progress">
                        <div 
                          className={`progress-bar ${getStoragePercentage() > 80 ? 'danger' : getStoragePercentage() > 60 ? 'warning' : 'success'}`}
                          style={{ width: `${getStoragePercentage()}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plan Features */}
                <div className="mt-4">
                  <h6 className="text-dark fw-bold mb-3">
                    <i className="fas fa-star me-2"></i>
                    Plan Özellikleri
                  </h6>
                  <div className="row">
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          Sınırsız ürün yönetimi
                        </li>
                        <li className="mb-2">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          AI destekli analizler
                        </li>
                        <li className="mb-2">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          Gelişmiş raporlama
                        </li>
                        <li className="mb-2">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          Çoklu kullanıcı desteği
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          Otomatik yedekleme
                        </li>
                        <li className="mb-2">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          API erişimi
                        </li>
                        <li className="mb-2">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          7/24 teknik destek
                        </li>
                        <li className="mb-2">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          Özel entegrasyonlar
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-3 mt-4">
                  <button className="btn btn-main">
                    <i className="fas fa-credit-card me-2"></i>
                    Planı Yükselt
                  </button>
                  <button className="btn btn-outline-main">
                    <i className="fas fa-file-invoice me-2"></i>
                    Fatura Geçmişi
                  </button>
                  <button className="btn btn-outline-main">
                    <i className="fas fa-download me-2"></i>
                    Fatura İndir
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;