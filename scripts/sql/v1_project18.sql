-- ---- V1 DATA MODEL ----

-- People / Roles table
CREATE TABLE IF NOT EXISTS people (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(50),
  role VARCHAR(100) NOT NULL,
  permissions JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Announcements authored by people, optionally scoped by role
CREATE TABLE IF NOT EXISTS announcements (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  created_by_email VARCHAR(255) NOT NULL,
  role_scope VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (created_by_email),
  INDEX (role_scope)
) ENGINE=InnoDB;

-- Ambassadors directory for Executive view
CREATE TABLE IF NOT EXISTS ambassadors (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  school VARCHAR(255),
  location VARCHAR(255),
  committee VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (email)
) ENGINE=InnoDB;

-- Remove Press-related SQL (safe if they don't exist)
DROP TABLE IF EXISTS press_posts;
DROP TABLE IF EXISTS press;
DROP TABLE IF EXISTS blog_posts;
DROP TABLE IF EXISTS admin_press;
