-- Create revision info table for Hibernate Envers
CREATE TABLE revinfo (
    rev INTEGER NOT NULL PRIMARY KEY,
    revtstmp BIGINT
);

-- Create audit table for users
CREATE TABLE users_aud (
    id UUID NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,
    username VARCHAR(100),
    email VARCHAR(255),
    password VARCHAR(255),
    full_name VARCHAR(200),
    phone_number VARCHAR(20),
    enabled BOOLEAN,
    account_locked BOOLEAN,
    two_fa_enabled BOOLEAN,
    two_fa_secret VARCHAR(255),
    last_login_at TIMESTAMP,
    failed_login_attempts INTEGER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    version BIGINT,
    PRIMARY KEY (id, rev),
    FOREIGN KEY (rev) REFERENCES revinfo (rev)
);

-- Create audit table for customers
CREATE TABLE customers_aud (
    id UUID NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,
    email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    total_orders INTEGER,
    total_spent DECIMAL(10,2),
    lifetime_value DECIMAL(10,2),
    average_order_value DECIMAL(10,2),
    last_order_at TIMESTAMP,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    billing_address_line1 VARCHAR(255),
    billing_address_line2 VARCHAR(255),
    billing_city VARCHAR(100),
    billing_state VARCHAR(100),
    billing_postal_code VARCHAR(20),
    billing_country VARCHAR(100),
    accepts_marketing BOOLEAN,
    notes VARCHAR(500),
    deleted_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    version BIGINT,
    PRIMARY KEY (id, rev),
    FOREIGN KEY (rev) REFERENCES revinfo (rev)
);

-- Create audit table for products
CREATE TABLE products_aud (
    id UUID NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,
    sku VARCHAR(100),
    name VARCHAR(500),
    slug VARCHAR(200),
    description TEXT,
    short_description VARCHAR(1000),
    price DECIMAL(10,2),
    compare_at_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    status VARCHAR(50),
    category VARCHAR(200),
    brand VARCHAR(200),
    weight_grams INTEGER,
    is_featured BOOLEAN,
    seo_title VARCHAR(200),
    seo_description VARCHAR(500),
    deleted_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    version BIGINT,
    PRIMARY KEY (id, rev),
    FOREIGN KEY (rev) REFERENCES revinfo (rev)
);

-- Create audit table for stock
CREATE TABLE stock_aud (
    id UUID NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,
    sku VARCHAR(100),
    product_id UUID,
    quantity INTEGER,
    reserved_quantity INTEGER,
    low_stock_threshold INTEGER,
    warehouse_location VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    version BIGINT,
    PRIMARY KEY (id, rev),
    FOREIGN KEY (rev) REFERENCES revinfo (rev)
);

-- Create audit table for orders
CREATE TABLE orders_aud (
    id UUID NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,
    order_number VARCHAR(50),
    customer_id UUID,
    status VARCHAR(50),
    payment_status VARCHAR(50),
    fulfillment_status VARCHAR(50),
    subtotal DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    shipping_amount DECIMAL(10,2),
    discount_amount DECIMAL(10,2),
    total DECIMAL(10,2),
    coupon_code VARCHAR(50),
    shipping_address_line1 VARCHAR(255),
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    shipping_country VARCHAR(100),
    tracking_number VARCHAR(100),
    carrier VARCHAR(100),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    notes TEXT,
    cancelled_at TIMESTAMP,
    cancelled_reason VARCHAR(500),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    version BIGINT,
    PRIMARY KEY (id, rev),
    FOREIGN KEY (rev) REFERENCES revinfo (rev)
);

-- Create audit table for order_items
CREATE TABLE order_items_aud (
    id UUID NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,
    order_id UUID,
    product_id UUID,
    sku VARCHAR(100),
    product_name VARCHAR(500),
    quantity INTEGER,
    unit_price DECIMAL(10,2),
    line_total DECIMAL(10,2),
    discount_amount DECIMAL(10,2),
    created_at TIMESTAMP,
    version BIGINT,
    PRIMARY KEY (id, rev),
    FOREIGN KEY (rev) REFERENCES revinfo (rev)
);

-- Create audit table for product_tags
CREATE TABLE product_tags_aud (
    product_id UUID NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,
    tag VARCHAR(255),
    PRIMARY KEY (product_id, rev, tag),
    FOREIGN KEY (rev) REFERENCES revinfo (rev)
);

-- Create audit table for product_images
CREATE TABLE product_images_aud (
    product_id UUID NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,
    url VARCHAR(1000),
    alt_text VARCHAR(500),
    image_order INTEGER,
    PRIMARY KEY (product_id, rev, image_order),
    FOREIGN KEY (rev) REFERENCES revinfo (rev)
);

-- Create sequence for revision numbers
CREATE SEQUENCE IF NOT EXISTS hibernate_sequence START WITH 1 INCREMENT BY 1;
