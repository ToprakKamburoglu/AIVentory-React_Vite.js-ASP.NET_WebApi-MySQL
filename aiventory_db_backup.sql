-- ===================================
-- AIVentory - MySQL Database Schema
-- ===================================

-- Veritabanı oluştur
CREATE DATABASE IF NOT EXISTS aiventory_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aiventory_db;

-- ===================================
-- 1. Companies Tablosu (Şirketler)
-- ===================================
CREATE TABLE Companies (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE,
    Phone VARCHAR(20),
    Address TEXT,
    City VARCHAR(100),
    Country VARCHAR(100) DEFAULT 'Turkey',
    TaxNumber VARCHAR(50),
    Website VARCHAR(255),
    Logo VARCHAR(500),
    SubscriptionPlan ENUM('Basic', 'Premium', 'Enterprise') DEFAULT 'Basic',
    SubscriptionStartDate DATE,
    SubscriptionEndDate DATE,
    MaxUsers INT DEFAULT 3,
    MaxProducts INT DEFAULT 1000,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_company_email (Email),
    INDEX idx_company_active (IsActive),
    INDEX idx_company_subscription (SubscriptionPlan)
);

-- ===================================
-- 2. Users Tablosu (Kullanıcılar)
-- ===================================
CREATE TABLE Users (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    CompanyId INT NOT NULL,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('admin', 'manager', 'employee') NOT NULL DEFAULT 'employee',
    Phone VARCHAR(20),
    Avatar VARCHAR(500),
    LastLoginAt TIMESTAMP NULL,
    IsActive BOOLEAN DEFAULT TRUE,
    EmailVerified BOOLEAN DEFAULT FALSE,
    EmailVerificationToken VARCHAR(100),
    PasswordResetToken VARCHAR(100),
    PasswordResetExpires TIMESTAMP NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE CASCADE,
    INDEX idx_user_email (Email),
    INDEX idx_user_company (CompanyId),
    INDEX idx_user_role (Role),
    INDEX idx_user_active (IsActive)
);

-- ===================================
-- 3. Categories Tablosu (Kategoriler)
-- ===================================
CREATE TABLE Categories (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    CompanyId INT NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    ParentId INT NULL, -- Alt kategori desteği için
    Icon VARCHAR(100),
    Color VARCHAR(7), -- Hex color code
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE CASCADE,
    FOREIGN KEY (ParentId) REFERENCES Categories(Id) ON DELETE SET NULL,
    INDEX idx_category_company (CompanyId),
    INDEX idx_category_parent (ParentId),
    INDEX idx_category_active (IsActive)
);

-- ===================================
-- 4. Products Tablosu (Ürünler)
-- ===================================
CREATE TABLE Products (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    CompanyId INT NOT NULL,
    CategoryId INT,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    Barcode VARCHAR(100) UNIQUE,
    SKU VARCHAR(100), -- Stock Keeping Unit
    Price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    CostPrice DECIMAL(10,2) DEFAULT 0.00,
    Currency VARCHAR(3) DEFAULT 'TRY',
    Brand VARCHAR(100),
    Model VARCHAR(100),
    Color VARCHAR(50),
    ColorCode VARCHAR(7), -- RGB hex code
    Size VARCHAR(50),
    Weight DECIMAL(8,2), -- kg cinsinden
    Dimensions VARCHAR(100), -- 20x30x10 cm formatında
    ImageUrl VARCHAR(500),
    Images JSON, -- Çoklu resim desteği
    MinimumStock INT DEFAULT 0,
    MaximumStock INT DEFAULT NULL,
    Unit VARCHAR(20) DEFAULT 'adet', -- adet, kg, lt vs.
    Tags JSON, -- Arama için etiketler
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedBy INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE CASCADE,
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id) ON DELETE SET NULL,
    FOREIGN KEY (CreatedBy) REFERENCES Users(Id) ON DELETE RESTRICT,
    INDEX idx_product_company (CompanyId),
    INDEX idx_product_category (CategoryId),
    INDEX idx_product_barcode (Barcode),
    INDEX idx_product_sku (SKU),
    INDEX idx_product_name (Name),
    INDEX idx_product_brand (Brand),
    INDEX idx_product_active (IsActive),
    FULLTEXT idx_product_search (Name, Description, Brand, Model)
);

-- ===================================
-- 5. Stock Tablosu (Stok Durumu)
-- ===================================
CREATE TABLE Stock (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    ProductId INT NOT NULL UNIQUE,
    CurrentStock INT NOT NULL DEFAULT 0,
    ReservedStock INT DEFAULT 0, -- Sipariş verilmiş ama henüz çıkmamış
    AvailableStock INT GENERATED ALWAYS AS (CurrentStock - ReservedStock) STORED,
    LastStockUpdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    LastCountDate DATE, -- Son sayım tarihi
    
    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE,
    INDEX idx_stock_product (ProductId),
    INDEX idx_stock_current (CurrentStock),
    INDEX idx_stock_available (AvailableStock)
);

-- ===================================
-- 6. Stock Movements Tablosu (Stok Hareketleri)
-- ===================================
CREATE TABLE StockMovements (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    ProductId INT NOT NULL,
    MovementType ENUM('in', 'out', 'adjustment', 'transfer', 'return') NOT NULL,
    Quantity INT NOT NULL,
    PreviousStock INT NOT NULL,
    NewStock INT NOT NULL,
    UnitCost DECIMAL(10,2),
    TotalCost DECIMAL(10,2),
    Reason VARCHAR(255),
    ReferenceId INT, -- Sipariş ID, Transfer ID vb.
    ReferenceType VARCHAR(50), -- 'sale', 'purchase', 'adjustment' vb.
    UserId INT NOT NULL,
    Notes TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE RESTRICT,
    INDEX idx_movement_product (ProductId),
    INDEX idx_movement_type (MovementType),
    INDEX idx_movement_user (UserId),
    INDEX idx_movement_date (CreatedAt),
    INDEX idx_movement_reference (ReferenceType, ReferenceId)
);

-- ===================================
-- 7. AI Analysis Tablosu (AI Analizleri)
-- ===================================
CREATE TABLE AIAnalysis (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    ProductId INT,
    CompanyId INT NOT NULL,
    ImageUrl VARCHAR(500) NOT NULL,
    AnalysisType ENUM('product_recognition', 'color_analysis', 'price_prediction', 'demand_forecast') NOT NULL,
    AnalysisResult JSON, -- AI sonuçları JSON formatında
    Confidence DECIMAL(5,2), -- 0.00 - 100.00 arası güven skoru
    DetectedName VARCHAR(255),
    DetectedCategory VARCHAR(100),
    DetectedBrand VARCHAR(100),
    DetectedColor VARCHAR(50),
    DetectedColorCode VARCHAR(7),
    SuggestedPrice DECIMAL(10,2),
    ProcessingTime INT, -- milisaniye cinsinden
    AIModel VARCHAR(100), -- Kullanılan AI model adı
    Status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    ErrorMessage TEXT,
    UserId INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE,
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE RESTRICT,
    INDEX idx_ai_product (ProductId),
    INDEX idx_ai_company (CompanyId),
    INDEX idx_ai_type (AnalysisType),
    INDEX idx_ai_status (Status),
    INDEX idx_ai_user (UserId),
    INDEX idx_ai_date (CreatedAt)
);

-- ===================================
-- 8. Suppliers Tablosu (Tedarikçiler)
-- ===================================
CREATE TABLE Suppliers (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    CompanyId INT NOT NULL,
    Name VARCHAR(255) NOT NULL,
    ContactPerson VARCHAR(100),
    Email VARCHAR(255),
    Phone VARCHAR(20),
    Address TEXT,
    City VARCHAR(100),
    Country VARCHAR(100),
    TaxNumber VARCHAR(50),
    Website VARCHAR(255),
    PaymentTerms VARCHAR(100), -- "30 gün vadeli" gibi
    Rating DECIMAL(2,1), -- 1.0 - 5.0 arası
    Notes TEXT,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE CASCADE,
    INDEX idx_supplier_company (CompanyId),
    INDEX idx_supplier_name (Name),
    INDEX idx_supplier_active (IsActive)
);

-- ===================================
-- 9. Product Suppliers Tablosu (Ürün-Tedarikçi İlişkisi)
-- ===================================
CREATE TABLE ProductSuppliers (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    ProductId INT NOT NULL,
    SupplierId INT NOT NULL,
    SupplierProductCode VARCHAR(100), -- Tedarikçideki ürün kodu
    PurchasePrice DECIMAL(10,2),
    Currency VARCHAR(3) DEFAULT 'TRY',
    MinOrderQuantity INT DEFAULT 1,
    LeadTimeDays INT DEFAULT 7, -- Teslimat süresi (gün)
    IsPreferred BOOLEAN DEFAULT FALSE, -- Tercih edilen tedarikçi
    LastPurchaseDate DATE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE,
    FOREIGN KEY (SupplierId) REFERENCES Suppliers(Id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_supplier (ProductId, SupplierId),
    INDEX idx_ps_product (ProductId),
    INDEX idx_ps_supplier (SupplierId),
    INDEX idx_ps_preferred (IsPreferred)
);

-- ===================================
-- 10. Stock Predictions Tablosu (Stok Tahminleri)
-- ===================================
CREATE TABLE StockPredictions (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    ProductId INT NOT NULL,
    CompanyId INT NOT NULL,
    PredictionDate DATE NOT NULL,
    PredictedDemand INT NOT NULL,
    CurrentStock INT NOT NULL,
    RecommendedOrderQuantity INT,
    StockOutDate DATE, -- Tahmini tükenmesine date
    Confidence DECIMAL(5,2), -- Tahmin güvenilirlik skoru
    SeasonalFactor DECIMAL(5,2), -- Mevsimsel etki faktörü
    TrendFactor DECIMAL(5,2), -- Trend etki faktörü
    AIModel VARCHAR(100),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE,
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_prediction_date (ProductId, PredictionDate),
    INDEX idx_prediction_product (ProductId),
    INDEX idx_prediction_company (CompanyId),
    INDEX idx_prediction_date (PredictionDate),
    INDEX idx_prediction_stockout (StockOutDate)
);

-- ===================================
-- 11. User Activities Tablosu (Kullanıcı Aktiviteleri)
-- ===================================
CREATE TABLE UserActivities (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT NOT NULL,
    CompanyId INT NOT NULL,
    Action VARCHAR(100) NOT NULL, -- 'product_added', 'stock_updated' vb.
    EntityType VARCHAR(50), -- 'product', 'stock', 'user' vb.
    EntityId INT,
    Description TEXT,
    IpAddress VARCHAR(45), -- IPv6 desteği için
    UserAgent TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE CASCADE,
    INDEX idx_activity_user (UserId),
    INDEX idx_activity_company (CompanyId),
    INDEX idx_activity_action (Action),
    INDEX idx_activity_entity (EntityType, EntityId),
    INDEX idx_activity_date (CreatedAt)
);

-- ===================================
-- 12. System Settings Tablosu (Sistem Ayarları)
-- ===================================
CREATE TABLE SystemSettings (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    CompanyId INT NOT NULL,
    SettingKey VARCHAR(100) NOT NULL,
    SettingValue TEXT,
    SettingType ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    Description TEXT,
    IsPublic BOOLEAN DEFAULT FALSE, -- Frontend'de görünür mü?
    UpdatedBy INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE CASCADE,
    FOREIGN KEY (UpdatedBy) REFERENCES Users(Id) ON DELETE SET NULL,
    UNIQUE KEY unique_company_setting (CompanyId, SettingKey),
    INDEX idx_setting_company (CompanyId),
    INDEX idx_setting_key (SettingKey),
    INDEX idx_setting_public (IsPublic)
);

-- ===================================
-- 13. Notifications Tablosu (Bildirimler)
-- ===================================
CREATE TABLE Notifications (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    CompanyId INT NOT NULL,
    UserId INT, -- NULL ise tüm şirkete gönderilir
    Title VARCHAR(255) NOT NULL,
    Message TEXT NOT NULL,
    Type ENUM('info', 'warning', 'error', 'success') DEFAULT 'info',
    Category ENUM('stock', 'ai', 'system', 'user') DEFAULT 'system',
    RelatedEntityType VARCHAR(50), -- 'product', 'stock' vb.
    RelatedEntityId INT,
    IsRead BOOLEAN DEFAULT FALSE,
    ReadAt TIMESTAMP NULL,
    ExpiresAt TIMESTAMP NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    INDEX idx_notification_company (CompanyId),
    INDEX idx_notification_user (UserId),
    INDEX idx_notification_type (Type),
    INDEX idx_notification_category (Category),
    INDEX idx_notification_read (IsRead),
    INDEX idx_notification_date (CreatedAt)
);

-- ===================================
-- Trigger'lar ve Stored Procedure'lar
-- ===================================

-- 1. Ürün oluşturulduğunda otomatik stok kaydı oluştur
DELIMITER //
CREATE TRIGGER after_product_insert 
AFTER INSERT ON Products
FOR EACH ROW
BEGIN
    INSERT INTO Stock (ProductId, CurrentStock, ReservedStock)
    VALUES (NEW.Id, 0, 0);
END//
DELIMITER ;

-- 2. Stok hareketi eklendiğinde stok durumunu güncelle
DELIMITER //
CREATE TRIGGER after_stock_movement_insert
AFTER INSERT ON StockMovements
FOR EACH ROW
BEGIN
    UPDATE Stock 
    SET CurrentStock = NEW.NewStock,
        LastStockUpdate = CURRENT_TIMESTAMP
    WHERE ProductId = NEW.ProductId;
END//
DELIMITER ;

-- 3. Kritik stok bildirimleri için trigger
DELIMITER //
CREATE TRIGGER check_low_stock
AFTER UPDATE ON Stock
FOR EACH ROW
BEGIN
    DECLARE min_stock INT DEFAULT 0;
    DECLARE product_name VARCHAR(255);
    DECLARE company_id INT;
    
    -- Minimum stok ve ürün bilgilerini al
    SELECT p.MinimumStock, p.Name, p.CompanyId
    INTO min_stock, product_name, company_id
    FROM Products p
    WHERE p.Id = NEW.ProductId;
    
    -- Eğer stok minimum seviyenin altına düştüyse bildirim oluştur
    IF NEW.CurrentStock <= min_stock AND NEW.CurrentStock < OLD.CurrentStock THEN
        INSERT INTO Notifications (
            CompanyId, 
            Title, 
            Message, 
            Type, 
            Category, 
            RelatedEntityType, 
            RelatedEntityId
        ) VALUES (
            company_id,
            'Kritik Stok Uyarısı',
            CONCAT(product_name, ' ürünü kritik stok seviyesinde! Mevcut stok: ', NEW.CurrentStock),
            'warning',
            'stock',
            'product',
            NEW.ProductId
        );
    END IF;
END//
DELIMITER ;

-- ===================================
-- Başlangıç Verileri (Seed Data)
-- ===================================

-- Demo şirket
INSERT INTO Companies (Name, Email, Phone, Address, City, SubscriptionPlan, MaxUsers, MaxProducts) 
VALUES ('Demo Market', 'demo@aiventory.com', '+90 555 123 4567', 'Demo Mahallesi, Demo Caddesi No:1', 'İstanbul', 'Premium', 10, 5000);

-- Demo admin kullanıcı (şifre: admin123)
INSERT INTO Users (CompanyId, FirstName, LastName, Email, PasswordHash, Role, IsActive, EmailVerified)
VALUES (1, 'Admin', 'User', 'admin@demo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', TRUE, TRUE);
INSERT INTO Users (CompanyId, FirstName, LastName, Email, PasswordHash, Role, Phone, IsActive, EmailVerified) 
VALUES (
    1, 
    'Ayşe', 
    'Kaya', 
    'manager@demo.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'manager', 
    '+90 555 234 5678', 
    TRUE, 
    TRUE
);

-- 2. Employee Kullanıcı 1
INSERT INTO Users (CompanyId, FirstName, LastName, Email, PasswordHash, Role, Phone, IsActive, EmailVerified) 
VALUES (
    1, 
    'Mehmet', 
    'Yılmaz', 
    'employee@demo.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'employee', 
    '+90 555 345 6789', 
    TRUE, 
    TRUE
);

-- 3. Employee Kullanıcı 2 (Kasiyer)
INSERT INTO Users (CompanyId, FirstName, LastName, Email, PasswordHash, Role, Phone, IsActive, EmailVerified) 
VALUES (
    1, 
    'Fatma', 
    'Demir', 
    'kasiyer@demo.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'employee', 
    '+90 555 456 7890', 
    TRUE, 
    TRUE
);

-- 4. Deaktif Kullanıcı (Test için)
INSERT INTO Users (CompanyId, FirstName, LastName, Email, PasswordHash, Role, Phone, IsActive, EmailVerified) 
VALUES (
    1, 
    'Ali', 
    'Özkan', 
    'inactive@demo.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'employee', 
    '+90 555 567 8901', 
    FALSE,  -- Deaktif kullanıcı
    FALSE   -- Email doğrulanmamış
);

-- Demo kategoriler
INSERT INTO Categories (CompanyId, Name, Description, Color) VALUES
(1, 'Elektronik', 'Telefon, bilgisayar, tablet vb.', '#2563EB'),
(1, 'Gıda', 'Yiyecek ve içecek ürünleri', '#16A34A'),
(1, 'Giyim', 'Kıyafet ve aksesuar', '#7C2D12'),
(1, 'Kozmetik', 'Kişisel bakım ürünleri', '#DB2777'),
(1, 'Ev & Yaşam', 'Ev eşyaları ve dekorasyon', '#059669');

-- Demo ürünler
INSERT INTO Products (CompanyId, CategoryId, Name, Description, Price, CostPrice, Brand, Color, ColorCode, MinimumStock, CreatedBy) VALUES
(1, 1, 'iPhone 15 Pro', 'Apple iPhone 15 Pro 128GB', 45000.00, 40000.00, 'Apple', 'Siyah', '#000000', 5, 1),
(1, 1, 'Samsung Galaxy S24', 'Samsung Galaxy S24 256GB', 35000.00, 30000.00, 'Samsung', 'Mavi', '#1E3A8A', 3, 1),
(1, 2, 'Coca Cola 330ml', 'Gazlı içecek', 8.50, 6.00, 'Coca Cola', 'Kırmızı', '#DC2626', 50, 1),
(1, 3, 'Nike Air Max', 'Spor ayakkabı', 2500.00, 2000.00, 'Nike', 'Beyaz', '#FFFFFF', 10, 1);

-- Demo stok durumları (Products trigger'ı otomatik oluşturacak ama manuel de ekleyelim)
INSERT INTO Stock (ProductId, CurrentStock, ReservedStock) VALUES
(1, 8, 0),  -- iPhone 15 Pro
(2, 2, 1),  -- Samsung Galaxy S24 - kritik stok
(3, 150, 0), -- Coca Cola
(4, 25, 2);  -- Nike Air Max

-- Demo sistem ayarları
INSERT INTO SystemSettings (CompanyId, SettingKey, SettingValue, SettingType, Description, IsPublic) VALUES
(1, 'company_name', 'Demo Market', 'string', 'Şirket adı', TRUE),
(1, 'currency', 'TRY', 'string', 'Para birimi', TRUE),
(1, 'tax_rate', '20', 'number', 'KDV oranı (%)', FALSE),
(1, 'low_stock_threshold', '10', 'number', 'Düşük stok uyarı eşiği', FALSE),
(1, 'ai_enabled', 'true', 'boolean', 'AI özellikleri aktif', TRUE);

-- ===================================
-- Views (Görünümler)
-- ===================================

-- Ürün stok durumu özet görünümü
CREATE VIEW ProductStockView AS
SELECT 
    p.Id,
    p.CompanyId,
    p.Name,
    p.Brand,
    p.Price,
    c.Name as CategoryName,
    s.CurrentStock,
    s.ReservedStock,
    s.AvailableStock,
    p.MinimumStock,
    CASE 
        WHEN s.CurrentStock <= 0 THEN 'out_of_stock'
        WHEN s.CurrentStock <= p.MinimumStock THEN 'low_stock'
        WHEN s.CurrentStock <= (p.MinimumStock * 1.5) THEN 'critical'
        ELSE 'in_stock'
    END as StockStatus,
    s.LastStockUpdate
FROM Products p
LEFT JOIN Categories c ON p.CategoryId = c.Id
LEFT JOIN Stock s ON p.Id = s.ProductId
WHERE p.IsActive = TRUE;

-- Günlük stok hareketleri özeti
CREATE VIEW DailyStockMovements AS
SELECT 
    DATE(sm.CreatedAt) as MovementDate,
    sm.ProductId,
    p.Name as ProductName,
    p.CompanyId,
    COUNT(*) as TotalMovements,
    SUM(CASE WHEN sm.MovementType = 'in' THEN sm.Quantity ELSE 0 END) as TotalIn,
    SUM(CASE WHEN sm.MovementType = 'out' THEN sm.Quantity ELSE 0 END) as TotalOut,
    SUM(CASE WHEN sm.MovementType = 'adjustment' THEN sm.Quantity ELSE 0 END) as TotalAdjustment
FROM StockMovements sm
JOIN Products p ON sm.ProductId = p.Id
GROUP BY DATE(sm.CreatedAt), sm.ProductId, p.Name, p.CompanyId;

-- ===================================
-- İndexler ve Optimizasyonlar
-- ===================================

-- Performans için composite index'ler
CREATE INDEX idx_products_company_category ON Products(CompanyId, CategoryId);
CREATE INDEX idx_products_company_active ON Products(CompanyId, IsActive);
CREATE INDEX idx_stock_movements_product_date ON StockMovements(ProductId, CreatedAt);
CREATE INDEX idx_notifications_company_user_read ON Notifications(CompanyId, UserId, IsRead);

UPDATE Stock SET CurrentStock = 8, ReservedStock = 0 WHERE ProductId = 1;
UPDATE Stock SET CurrentStock = 2, ReservedStock = 1 WHERE ProductId = 2;  
UPDATE Stock SET CurrentStock = 150, ReservedStock = 0 WHERE ProductId = 3;
UPDATE Stock SET CurrentStock = 25, ReservedStock = 2 WHERE ProductId = 4;