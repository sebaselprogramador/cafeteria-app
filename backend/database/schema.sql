-- =====================================================================
-- Base de datos: cafeteria_db (MySQL 8+)
-- Tablas que necesita el frontend Angular (todo llega por la API Node)
-- =====================================================================
CREATE DATABASE IF NOT EXISTS cafeteria_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cafeteria_db;

-- Datos generales del local: nombre, dirección, teléfono, horario, textos del inicio
CREATE TABLE IF NOT EXISTS configuracion (
  clave       VARCHAR(60)  PRIMARY KEY,
  valor       TEXT         NOT NULL,
  actualizado TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Videos en bucle para la página de Inicio (Pexels)
CREATE TABLE IF NOT EXISTS videos_inicio (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo      VARCHAR(120) NOT NULL,
  url_video   VARCHAR(500) NOT NULL,
  url_poster  VARCHAR(500) NULL,
  fuente      VARCHAR(255) NULL,
  activo      TINYINT(1)   NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- Servicios que ofrece la cafetería (Servicios)
CREATE TABLE IF NOT EXISTS servicios (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(120) NOT NULL,
  descripcion TEXT         NULL,
  icono       VARCHAR(60)  NULL,
  orden       INT          NOT NULL DEFAULT 0,
  activo      TINYINT(1)   NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- Especialidades de la casa (Especialidades)
CREATE TABLE IF NOT EXISTS especialidades (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(120) NOT NULL,
  descripcion TEXT         NULL,
  imagen_url  VARCHAR(500) NULL,
  orden       INT          NOT NULL DEFAULT 0,
  activo      TINYINT(1)   NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- Secciones de la historia / información de "Nosotros"
CREATE TABLE IF NOT EXISTS nosotros_secciones (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo      VARCHAR(120) NOT NULL,
  contenido   TEXT         NOT NULL,
  orden       INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Fotos de la tienda (Nosotros)
CREATE TABLE IF NOT EXISTS fotos_tienda (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  imagen_url  VARCHAR(500) NOT NULL,
  descripcion VARCHAR(255) NULL,
  orden       INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Lista de precios (Precios), agrupada por categoría
CREATE TABLE IF NOT EXISTS precios (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  categoria   VARCHAR(60)   NOT NULL,
  nombre      VARCHAR(120)  NOT NULL,
  descripcion VARCHAR(255)  NULL,
  precio      DECIMAL(10,2) NOT NULL,
  moneda      VARCHAR(10)   NOT NULL DEFAULT 'Bs',
  orden       INT           NOT NULL DEFAULT 0,
  activo      TINYINT(1)    NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- Mensajes del formulario de Contactos
CREATE TABLE IF NOT EXISTS contactos (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(120) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  telefono    VARCHAR(30)  NULL,
  asunto      VARCHAR(150) NULL,
  mensaje     TEXT         NOT NULL,
  creado_en   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Historial del chatbot (Ollama + gemma3)
CREATE TABLE IF NOT EXISTS chat_mensajes (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sesion_id   VARCHAR(64)  NOT NULL,
  rol         ENUM('user','assistant') NOT NULL,
  contenido   TEXT         NOT NULL,
  creado_en   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sesion (sesion_id, creado_en)
) ENGINE=InnoDB;
