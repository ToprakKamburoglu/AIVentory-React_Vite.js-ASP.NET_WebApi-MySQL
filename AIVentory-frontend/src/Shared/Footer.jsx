import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="d-flex align-items-center mb-3">
              <span className="fw-bold text-white fs-4">AIVentory</span>
            </div>
            <p className="mb-3">
              AI destekli stok yönetimi ile işletmenizi geleceğe taşıyın. 
              Akıllı çözümlerle stok kontrolünüzü kolaylaştırın.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-decoration-none">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="#" className="text-decoration-none">
                <i className="fab fa-linkedin fa-lg"></i>
              </a>
              <a href="#" className="text-decoration-none">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
              <a href="#" className="text-decoration-none">
                <i className="fab fa-youtube fa-lg"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-white mb-3">Ürün</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/features">Özellikler</Link>
              </li>
              <li className="mb-2">
                <Link to="/pricing">Fiyatlandırma</Link>
              </li>
              <li className="mb-2">
                <a href="#">API Dokümantasyonu</a>
              </li>
              <li className="mb-2">
                <a href="#">Entegrasyonlar</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-white mb-3">Şirket</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#">Hakkımızda</a>
              </li>
              <li className="mb-2">
                <a href="#">Blog</a>
              </li>
              <li className="mb-2">
                <a href="#">Kariyer</a>
              </li>
              <li className="mb-2">
                <a href="#">Basın Kiti</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-white mb-3">Destek</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/contact">İletişim</Link>
              </li>
              <li className="mb-2">
                <a href="#">Yardım Merkezi</a>
              </li>
              <li className="mb-2">
                <a href="#">Canlı Destek</a>
              </li>
              <li className="mb-2">
                <a href="#">Durum Sayfası</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-white mb-3">Yasal</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#">Gizlilik Politikası</a>
              </li>
              <li className="mb-2">
                <a href="#">Kullanım Şartları</a>
              </li>
              <li className="mb-2">
                <a href="#">Çerez Politikası</a>
              </li>
              <li className="mb-2">
                <a href="#">KVKK</a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" style={{borderColor: '#475569'}} />

        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0">
              &copy; {currentYear} AIVentory. Tüm hakları saklıdır.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <span className="text-sm">
              Türkiye'de ❤️ ile geliştirildi
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;