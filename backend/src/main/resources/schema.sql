-- Table Users
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- ADMIN, PROPRIETOR, VISITOR
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    neighborhood VARCHAR(255),
    city VARCHAR(255),
    proprietor_status VARCHAR(50) -- PENDING, APPROVED, REJECTED
);

-- Table Properties
CREATE TABLE IF NOT EXISTS properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DOUBLE PRECISION,
    location VARCHAR(255),
    category VARCHAR(50), -- VILLA, APARTMENT, LOFT, LAND
    status VARCHAR(50), -- AVAILABLE, SOLD
    main_image_url VARCHAR(255),
    proprietor_name VARCHAR(255),
    proprietor_phone VARCHAR(255),
    proprietor_id BIGINT,
    FOREIGN KEY (proprietor_id) REFERENCES users(id)
);

-- Table for Characteristic Images (Simple element collection simulation)
CREATE TABLE IF NOT EXISTS property_characteristic_images (
    property_id BIGINT NOT NULL,
    characteristic_images VARCHAR(255),
    FOREIGN KEY (property_id) REFERENCES properties(id)
);

-- Table Visit Requests
CREATE TABLE IF NOT EXISTS visit_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT,
    visitor_id BIGINT,
    visit_date VARCHAR(50),
    status VARCHAR(50), -- PENDING, APPROVED, REJECTED
    message TEXT,
    FOREIGN KEY (property_id) REFERENCES properties(id),
    FOREIGN KEY (visitor_id) REFERENCES users(id)
);

-- Table Purchases
CREATE TABLE IF NOT EXISTS purchases (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT,
    user_id BIGINT,
    purchase_date TIMESTAMP,
    amount DOUBLE PRECISION,
    transaction_reference VARCHAR(255),
    FOREIGN KEY (property_id) REFERENCES properties(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table Favorites
CREATE TABLE IF NOT EXISTS favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    property_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (property_id) REFERENCES properties(id),
    UNIQUE(user_id, property_id)
);

-- Table Comparisons
CREATE TABLE IF NOT EXISTS comparisons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    property_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (property_id) REFERENCES properties(id),
    UNIQUE(user_id, property_id)
);

-- Initial Data commented out (Let DataInitializer handle it for consistent roles/prices)
-- INSERT INTO users (username, password, role, full_name, email, phone, proprietor_status) VALUES ...
-- INSERT INTO properties (title, description, price, location, category, status, main_image_url, proprietor_name, proprietor_phone, proprietor_id) VALUES ...

CREATE TABLE IF NOT EXISTS comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE IF NOT EXISTS virtual_tour_payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    property_id BIGINT,
    amount DOUBLE PRECISION,
    payment_date TIMESTAMP,
    transaction_id VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (property_id) REFERENCES properties(id)
);
