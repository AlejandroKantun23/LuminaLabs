--  Base de datos: papeleria   (MySQL 8.0.16+)
--  App móvil (clientes) + Web (admin / POS)
DROP DATABASE IF EXISTS papeleria;
CREATE DATABASE papeleria CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE papeleria;

-- USUARIOS  (clientes, empleados y admins)
--    telefono es OPCIONAL (NULL): no se pide al registrarse.
--    password guarda el HASH (bcrypt/argon2), nunca texto plano.
CREATE TABLE usuarios (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  password    VARCHAR(255) NOT NULL,
  telefono    VARCHAR(20)  NULL,
  rol         ENUM('cliente','empleado','admin') NOT NULL DEFAULT 'cliente',
  activo      TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB;

-- CATEGORÍAS
CREATE TABLE categorias (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(60) NOT NULL,
  descripcion  TEXT NULL,
  UNIQUE KEY uq_categorias_nombre (nombre)
) ENGINE=InnoDB;

-- PRODUCTOS / INVENTARIO
--    sku           -> código interno que ya usa tu front (CUA-100R, LAP-HB02)
--    stock_minimo  -> para "Stock bajo" en el inventario
--    activo        -> en vez de borrar productos con historial
CREATE TABLE productos (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  categoria_id   INT NOT NULL,
  sku            VARCHAR(30)  NULL,
  nombre         VARCHAR(120) NOT NULL,
  descripcion    TEXT NULL,
  precio         DECIMAL(10,2) NOT NULL,
  stock          INT NOT NULL DEFAULT 0,
  stock_minimo   INT NOT NULL DEFAULT 5,
  codigo_barras  VARCHAR(30)  NULL,
  imagen_url     VARCHAR(255) NULL,
  activo         TINYINT(1) NOT NULL DEFAULT 1,
  UNIQUE KEY uq_productos_barras (codigo_barras),
  UNIQUE KEY uq_productos_sku (sku),
  KEY ix_productos_categoria (categoria_id),
  KEY ix_productos_nombre (nombre),
  CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id)
    REFERENCES categorias(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT ck_productos_precio CHECK (precio >= 0),
  CONSTRAINT ck_productos_stock  CHECK (stock  >= 0)
) ENGINE=InnoDB;

-- PEDIDOS (apartados desde la app) Y SU DETALLE
--    El stock se APARTA al crear el pedido y se DEVUELVE si se cancela.
CREATE TABLE pedidos (
  id                     INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id             INT NOT NULL,
  estado                 ENUM('pendiente','confirmado_apartado','listo_en_tienda','completado','cancelado')
                         NOT NULL DEFAULT 'pendiente',
  total                  DECIMAL(10,2) NOT NULL DEFAULT 0,
  fecha_creacion         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_limite_recogida  DATETIME NULL,   -- si viene NULL, un trigger pone +3 días
  fecha_actualizacion    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY ix_pedidos_usuario (usuario_id),
  KEY ix_pedidos_estado_limite (estado, fecha_limite_recogida),
  CONSTRAINT fk_pedidos_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT ck_pedidos_total CHECK (total >= 0)
) ENGINE=InnoDB;

CREATE TABLE detalle_pedidos (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id        INT NOT NULL,
  producto_id      INT NOT NULL,
  cantidad         INT NOT NULL,
  precio_unitario  DECIMAL(10,2) NOT NULL,
  KEY ix_dp_pedido (pedido_id),
  KEY ix_dp_producto (producto_id),
  CONSTRAINT fk_dp_pedido FOREIGN KEY (pedido_id)
    REFERENCES pedidos(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_dp_producto FOREIGN KEY (producto_id)
    REFERENCES productos(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT ck_dp_cantidad CHECK (cantidad > 0)
) ENGINE=InnoDB;

-- VENTAS (POS) Y SU DETALLE
--    usuario_id = empleado que cobró.
--    pedido_id  = si la venta salió de un apartado (NULL = venta directa).
CREATE TABLE ventas (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id   INT NOT NULL,
  pedido_id    INT NULL,
  total        DECIMAL(10,2) NOT NULL DEFAULT 0,
  metodo_pago  ENUM('efectivo','tarjeta','transferencia') NOT NULL DEFAULT 'efectivo',
  fecha_venta  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ventas_pedido (pedido_id),
  KEY ix_ventas_fecha (fecha_venta),
  KEY ix_ventas_usuario (usuario_id),
  CONSTRAINT fk_ventas_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_ventas_pedido FOREIGN KEY (pedido_id)
    REFERENCES pedidos(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT ck_ventas_total CHECK (total >= 0)
) ENGINE=InnoDB;

CREATE TABLE detalle_ventas (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  venta_id         INT NOT NULL,
  producto_id      INT NOT NULL,
  cantidad         INT NOT NULL,
  precio_unitario  DECIMAL(10,2) NOT NULL,
  KEY ix_dv_venta (venta_id),
  KEY ix_dv_producto (producto_id),
  CONSTRAINT fk_dv_venta FOREIGN KEY (venta_id)
    REFERENCES ventas(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_dv_producto FOREIGN KEY (producto_id)
    REFERENCES productos(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT ck_dv_cantidad CHECK (cantidad > 0)
) ENGINE=InnoDB;

--  TRIGGERS (control automático de stock)
DELIMITER $$

-- Pedido nuevo: límite de recogida = +3 días si no se especifica
CREATE TRIGGER trg_pedidos_bi BEFORE INSERT ON pedidos
FOR EACH ROW
BEGIN
  IF NEW.fecha_limite_recogida IS NULL THEN
    SET NEW.fecha_limite_recogida = DATE_ADD(NOW(), INTERVAL 3 DAY);
  END IF;
END$$

-- Apartar: descuenta stock (si no alcanza, rechaza el apartado)
CREATE TRIGGER trg_dp_bi BEFORE INSERT ON detalle_pedidos
FOR EACH ROW
BEGIN
  DECLARE v_stock INT;
  SELECT stock INTO v_stock FROM productos WHERE id = NEW.producto_id FOR UPDATE;
  IF v_stock < NEW.cantidad THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock insuficiente para apartar el producto';
  END IF;
  UPDATE productos SET stock = stock - NEW.cantidad WHERE id = NEW.producto_id;
END$$

-- Cancelar pedido: devuelve el stock apartado
CREATE TRIGGER trg_pedidos_au AFTER UPDATE ON pedidos
FOR EACH ROW
BEGIN
  IF NEW.estado = 'cancelado' AND OLD.estado <> 'cancelado' THEN
    UPDATE productos p
    JOIN detalle_pedidos d ON d.producto_id = p.id
    SET p.stock = p.stock + d.cantidad
    WHERE d.pedido_id = NEW.id;
  END IF;
END$$

-- Venta directa: descuenta stock. Si la venta viene de un apartado
-- (pedido_id NOT NULL) el stock ya se descontó al apartar.
CREATE TRIGGER trg_dv_bi BEFORE INSERT ON detalle_ventas
FOR EACH ROW
BEGIN
  DECLARE v_pedido INT;
  DECLARE v_stock  INT;
  SELECT pedido_id INTO v_pedido FROM ventas WHERE id = NEW.venta_id;
  IF v_pedido IS NULL THEN
    SELECT stock INTO v_stock FROM productos WHERE id = NEW.producto_id FOR UPDATE;
    IF v_stock < NEW.cantidad THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock insuficiente para la venta';
    END IF;
    UPDATE productos SET stock = stock - NEW.cantidad WHERE id = NEW.producto_id;
  END IF;
END$$

--  PROCEDIMIENTO: cobrar un apartado en el POS
--  CALL sp_completar_pedido(pedido_id, empleado_id, 'efectivo');
CREATE PROCEDURE sp_completar_pedido(
  IN p_pedido_id INT, IN p_empleado_id INT,
  IN p_metodo ENUM('efectivo','tarjeta','transferencia'))
BEGIN
  DECLARE v_estado VARCHAR(30);
  DECLARE v_total  DECIMAL(10,2);
  DECLARE v_venta  INT;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN ROLLBACK; RESIGNAL; END;

  START TRANSACTION;
  SELECT estado, total INTO v_estado, v_total
    FROM pedidos WHERE id = p_pedido_id FOR UPDATE;

  IF v_estado IS NULL OR v_estado NOT IN ('confirmado_apartado','listo_en_tienda') THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El pedido no existe o no se puede cobrar en su estado actual';
  END IF;

  INSERT INTO ventas (usuario_id, pedido_id, total, metodo_pago)
  VALUES (p_empleado_id, p_pedido_id, v_total, p_metodo);
  SET v_venta = LAST_INSERT_ID();

  INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario)
  SELECT v_venta, producto_id, cantidad, precio_unitario
    FROM detalle_pedidos WHERE pedido_id = p_pedido_id;

  UPDATE pedidos SET estado = 'completado' WHERE id = p_pedido_id;
  COMMIT;

  SELECT v_venta AS venta_id;
END$$

DELIMITER ;

--  EVENTO: cancelar apartados vencidos (cada hora)
--  Requiere:  SET GLOBAL event_scheduler = ON;
CREATE EVENT ev_cancelar_pedidos_vencidos
ON SCHEDULE EVERY 1 HOUR
DO
  UPDATE pedidos
     SET estado = 'cancelado'
   WHERE estado IN ('pendiente','confirmado_apartado','listo_en_tienda')
     AND fecha_limite_recogida < NOW();

--  VISTAS
-- Inventario: estado calculado
CREATE VIEW v_inventario AS
SELECT p.id, p.sku, p.codigo_barras, p.nombre, p.descripcion, c.nombre AS categoria,
       p.precio, p.stock, p.stock_minimo, p.imagen_url, p.activo,
       CASE WHEN p.stock = 0 THEN 'Sin existencias'
            WHEN p.stock <= p.stock_minimo THEN 'Stock bajo'
            ELSE 'Disponible' END AS estatus
FROM productos p JOIN categorias c ON c.id = p.categoria_id;

-- Lista de pedidos con folio P-00125, cliente, resumen de artículos
CREATE VIEW v_pedidos AS
SELECT pe.id, pe.usuario_id, CONCAT('P-', LPAD(pe.id,5,'0')) AS folio,
       u.nombre AS cliente, u.telefono AS contacto,
       pe.estado, pe.total, pe.fecha_creacion, pe.fecha_limite_recogida,
       SUM(d.cantidad) AS articulos_count,
       GROUP_CONCAT(CONCAT(d.cantidad,' ',p.nombre) SEPARATOR ', ') AS articulos_resumen
FROM pedidos pe
JOIN usuarios u ON u.id = pe.usuario_id
LEFT JOIN detalle_pedidos d ON d.pedido_id = pe.id
LEFT JOIN productos p ON p.id = d.producto_id
GROUP BY pe.id, pe.usuario_id, u.nombre, u.telefono, pe.estado, pe.total, pe.fecha_creacion, pe.fecha_limite_recogida;

-- Lista de ventas con ticket T-000001
CREATE VIEW v_ventas AS
SELECT v.id, CONCAT('T-', LPAD(v.id,6,'0')) AS ticket, v.fecha_venta,
       v.total, v.metodo_pago, e.nombre AS atendio,
       COALESCE(SUM(d.cantidad),0) AS articulos, v.pedido_id
FROM ventas v
JOIN usuarios e ON e.id = v.usuario_id
LEFT JOIN detalle_ventas d ON d.venta_id = v.id
GROUP BY v.id, e.nombre;

--  DATOS DE EJEMPLO 
INSERT INTO categorias (nombre, descripcion) VALUES
 ('Cuadernos','Cuadernos y libretas'),
 ('Escritura','Lápices, plumas y marcatextos'),
 ('Papel','Hojas, resmas y cartulinas'),
 ('Arte','Colores, marcadores y pinturas'),
 ('Escolar','Tijeras, pegamento y útiles escolares');

INSERT INTO usuarios (nombre,email,password,telefono,rol) VALUES
 ('Dueño','admin@papeleria.com','$2b$10$5B7PXw4KdwiGIyOC96xhl.kme3Tzk7N0wLKFvrBaEgpvpP8Kkk1Se',NULL,'admin'),
 ('Caja 1','empleado@papeleria.com','$2b$10$W8oytSwc1N.uK8Nn0QZIieu2CLfZ73ThlprDxCDU6PB01x.RAs6Ai',NULL,'empleado'),
 ('Carlos','carlos@correo.com','$2b$10$fwsQJq9AIuYFFxBIZI1vM.uz2ErOA0la1BOKwjddObLrN8LOFFUkq',NULL,'cliente');

INSERT INTO productos (categoria_id,sku,nombre,descripcion,precio,stock,stock_minimo,codigo_barras) VALUES
 (1,'CUA-100R','Cuaderno profesional','Raya, 100 hojas',45.00,48,20,'750000000001'),
 (2,'LAP-HB02','Lápiz de grafito HB','No. 2',6.00,8,15,'750000000002'),
 (4,'MAR-12C','Marcadores de colores','Estuche de 12 piezas',68.00,0,8,'750000000003'),
 (5,'TIJ-13CM','Tijeras escolares','Punta redonda',25.00,12,6,'750000000004');
