CREATE DATABASE RecipeBook;
USE RecipeBook;

-- =========================
-- USERS
-- =========================
CREATE TABLE USERS (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- RECIPE
-- =========================
CREATE TABLE RECIPE (
    recipe_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    thumbnail_url VARCHAR(500),
    cooking_time INT,
    review TEXT,
    memo TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

CREATE INDEX idx_recipe_user_id ON RECIPE(user_id);

-- =========================
-- INGREDIENT
-- =========================
CREATE TABLE INGREDIENT (
    ingredient_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2),
    unit VARCHAR(20),
    sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (recipe_id) REFERENCES RECIPE(recipe_id) ON DELETE CASCADE
);

CREATE INDEX idx_ingredient_recipe_id ON INGREDIENT(recipe_id);

-- =========================
-- RECIPE_STEP
-- =========================
CREATE TABLE RECIPE_STEP (
    step_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    step_type VARCHAR(10) NOT NULL
        CHECK (step_type IN ('FOOD', 'SAUCE')),
    step_order INT NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    FOREIGN KEY (recipe_id) REFERENCES RECIPE(recipe_id) ON DELETE CASCADE
);

CREATE INDEX idx_recipe_step_recipe_id ON RECIPE_STEP(recipe_id);

-- =========================
-- MEMORY
-- =========================
CREATE TABLE MEMORY (
    memory_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    memory_date DATE,
    with_whom VARCHAR(200),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES RECIPE(recipe_id) ON DELETE CASCADE
);

CREATE INDEX idx_memory_recipe_id ON MEMORY(recipe_id);

-- =========================
-- MEMORY_IMAGE
-- =========================
CREATE TABLE MEMORY_IMAGE (
    memory_image_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    memory_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (memory_id) REFERENCES MEMORY(memory_id) ON DELETE CASCADE
);

CREATE INDEX idx_memory_image_memory_id ON MEMORY_IMAGE(memory_id);

-- =========================
-- CATEGORY
-- =========================
CREATE TABLE CATEGORY (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

CREATE INDEX idx_category_user_id ON CATEGORY(user_id);

-- =========================
-- RECIPE_CATEGORY (N:M)
-- =========================
CREATE TABLE RECIPE_CATEGORY (
    recipe_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    PRIMARY KEY (recipe_id, category_id),
    FOREIGN KEY (recipe_id) REFERENCES RECIPE(recipe_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES CATEGORY(category_id) ON DELETE CASCADE
);

CREATE INDEX idx_recipe_category_category_id ON RECIPE_CATEGORY(category_id);

-- =========================
-- RECIPE_BOOK
-- =========================
CREATE TABLE RECIPE_BOOK (
    recipe_book_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
        CHECK (status IN ('DRAFT', 'GENERATED', 'ORDERED')),
    external_book_id VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

CREATE INDEX idx_recipe_book_user_id ON RECIPE_BOOK(user_id);

-- =========================
-- RECIPE_BOOK_ITEM
-- =========================
CREATE TABLE RECIPE_BOOK_ITEM (
    item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_book_id BIGINT NOT NULL,
    recipe_id BIGINT NOT NULL,
    section_title VARCHAR(100),
    sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (recipe_book_id) REFERENCES RECIPE_BOOK(recipe_book_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES RECIPE(recipe_id) ON DELETE CASCADE
);

CREATE INDEX idx_recipe_book_item_book_id ON RECIPE_BOOK_ITEM(recipe_book_id);

-- =========================
-- ORDERS
-- =========================
CREATE TABLE ORDERS (
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    recipe_book_id BIGINT NOT NULL,
    external_order_id VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id),
    FOREIGN KEY (recipe_book_id) REFERENCES RECIPE_BOOK(recipe_book_id)
);

CREATE INDEX idx_orders_user_id ON ORDERS(user_id);