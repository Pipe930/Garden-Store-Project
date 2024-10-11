CREATE TYPE tipo_estado_suscripcion AS ENUM ('ACTIVA', 'INACTIVA');
CREATE TYPE tipo_acciones AS ENUM ('LEER', 'CREAR', 'MODIFICAR', 'ELIMINAR');
CREATE TYPE tipo_estado_disponibilidad AS ENUM ('EN STOCK', 'SIN STOCK', 'POCO STOCK');
CREATE TYPE tipo_estado_venta AS ENUM ('PENDIENTE', 'PAGADO', 'CANCELADO');
CREATE TYPE tipo_entrega AS ENUM ('RETIRO EN TIENDA', 'DESPACHO A DOMICILIO');
CREATE TYPE tipo_estado_envio AS ENUM ('EN PROCESO', 'ENVIADO', 'ENTREGADO', 'CANCELADO');
CREATE TYPE tipo_metodo_pago AS ENUM ('TARJETA DE CREDITO', 'TARJETA DE DEBITO', 'TRANSFERENCIA BANCARIA', 'EFECTIVO');
CREATE TYPE tipo_genero AS ENUM('H', 'M', 'O');

CREATE TABLE IF NOT EXISTS USUARIO (

    id_usuario SERIAL NOT NULL,
    nombre VARCHAR(50) NULL,
    apellido VARCHAR(50) NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    activo BOOLEAN NOT NULL DEFAULT false,
    telefono VARCHAR(12) NOT NULL,
    ultimo_login TIMESTAMP NULL,
    contrasena VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_usuario PRIMARY KEY (id_usuario),
    CONSTRAINT ck_telefono CHECK(telefono ~ '^\+569\d{8}$')
);

CREATE TABLE IF NOT EXISTS REFRESH_TOKEN (

    id_refresh_token SERIAL NOT NULL,
    token VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_refresh_token PRIMARY KEY (id_refresh_token),
    CONSTRAINT fk_refresh_token_usuario FOREIGN KEY (id_refresh_token) REFERENCES USUARIO(id_usuario)
);

CREATE TABLE IF NOT EXISTS SUSCRIPCION (

    id_suscripcion_usuario SERIAL NOT NULL,
    fecha_creacion DATE NOT NULL,
    estado tipo_estado_suscripcion NOT NULL,
    monto_mensual INTEGER NOT NULL,

    CONSTRAINT pk_suscripcion PRIMARY KEY (id_suscripcion_usuario),
    CONSTRAINT fk_suscripcion_usuario FOREIGN KEY (id_suscripcion_usuario) REFERENCES USUARIO(id_usuario)
);

CREATE TABLE IF NOT EXISTS REGION (
    
    id_region SERIAL NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(2) NOT NULL,
    UNIQUE (nombre, codigo),

    CONSTRAINT pk_region PRIMARY KEY (id_region)
);

CREATE TABLE IF NOT EXISTS PROVINCIA (

    id_provincia SERIAL NOT NULL,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    id_region SERIAL NOT NULL,

    CONSTRAINT pk_provincia PRIMARY KEY (id_provincia),
    CONSTRAINT fk_provincia_region FOREIGN KEY (id_region) REFERENCES REGION(id_region) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS COMUNA (

    id_comuna SERIAL NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    id_provincia SERIAL NOT NULL,

    CONSTRAINT pk_comuna PRIMARY KEY (id_comuna),
    CONSTRAINT fk_comuna_provincia FOREIGN KEY (id_provincia) REFERENCES PROVINCIA(id_provincia)
);

CREATE TABLE IF NOT EXISTS DIRECCION (

    id_direccion SERIAL NOT NULL,
    nombre_direccion VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NOT NULL UNIQUE,
    num_departamento VARCHAR(10) NOT NULL,
    ciudad VARCHAR(60) NOT NULL,
    id_comuna SERIAL NOT NULL,

    CONSTRAINT pk_direccion PRIMARY KEY (id_direccion),
    CONSTRAINT fk_direccion_comuna FOREIGN KEY (id_comuna) REFERENCES COMUNA(id_comuna) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS DIRECCION_USUARIO (

    id_direccion_usuario SERIAL NOT NULL,
    id_usuario SERIAL NOT NULL,
    id_direccion SERIAL NOT NULL,

    CONSTRAINT pk_direccion_usuario PRIMARY KEY (id_direccion_usuario),
    CONSTRAINT fk_direccion_usuario_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_direccion_usuario_direccion FOREIGN KEY (id_direccion) REFERENCES DIRECCION(id_direccion) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS PERMISO (

    id_permiso SERIAL NOT NULL,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    recurso VARCHAR(40) NOT NULL,
    acciones tipo_acciones NOT NULL,
    descripcion TEXT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_permiso PRIMARY KEY (id_permiso)
);

CREATE TABLE IF NOT EXISTS ROL (

    id_rol SERIAL NOT NULL,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_rol PRIMARY KEY (id_rol)
);

CREATE TABLE IF NOT EXISTS ROL_PERMISO (

    id_rol_permiso SERIAL NOT NULL,
    fecha_asignacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_rol SERIAL NOT NULL,
    id_permiso SERIAL NOT NULL,

    CONSTRAINT pk_rol_permiso PRIMARY KEY (id_rol_permiso),
    CONSTRAINT fk_rol_permiso_rol FOREIGN KEY (id_rol) REFERENCES ROL(id_rol) ON DELETE CASCADE,
    CONSTRAINT fk_rol_permiso_permiso FOREIGN KEY (id_permiso) REFERENCES PERMISO(id_permiso) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS USUARIO_ROL (

    id_usuario_rol SERIAL NOT NULL,
    fecha_asignacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario SERIAL NOT NULL,
    id_rol SERIAL NOT NULL,

    CONSTRAINT pk_usuario_rol PRIMARY KEY (id_usuario_rol),
    CONSTRAINT fk_usuario_rol_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
    CONSTRAINT fk_usuario_rol_rol FOREIGN KEY (id_rol) REFERENCES ROL(id_rol)
);

CREATE TABLE IF NOT EXISTS CATEGORIA (

    id_categoria SERIAL NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    descripcion TEXT NULL,
    UNIQUE (nombre, slug),

    CONSTRAINT pk_categoria PRIMARY KEY (id_categoria)
);

CREATE TABLE IF NOT EXISTS GARANTIA (

    id_garantia SERIAL NOT NULL,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    duracion VARCHAR(40) NOT NULL,
    descripcion TEXT NULL,

    CONSTRAINT pk_garantia PRIMARY KEY (id_garantia)
);

CREATE TABLE IF NOT EXISTS OFERTA (

    id_oferta SERIAL NOT NULL,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descuento INTEGER NOT NULL,
    fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_fin DATE NOT NULL,
    descripcion TEXT NULL,

    CONSTRAINT pk_oferta PRIMARY KEY (id_oferta)
);

CREATE TABLE IF NOT EXISTS PRODUCTO (

    id_producto SERIAL NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    precio INTEGER NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    cantidad_vendida INTEGER NOT NULL DEFAULT 0,
    precio_descuento INTEGER NOT NULL DEFAULT 0,
    marca VARCHAR(100) NOT NULL,
    publico BOOLEAN NOT NULL DEFAULT false,
    rating DECIMAL(3, 2) NOT NULL DEFAULT 0.0,
    cantidad_resenas INTEGER NOT NULL DEFAULT 0,
    estado_disponibilidad tipo_estado_disponibilidad NOT NULL,
    politica_retorno VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    descripcion TEXT NULL,
    id_categoria SERIAL NOT NULL,
    id_garantia SERIAL NOT NULL,
    id_oferta SERIAL,
    UNIQUE (titulo, slug),

    CONSTRAINT pk_producto PRIMARY KEY (id_producto),
    CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) REFERENCES CATEGORIA(id_categoria),
    CONSTRAINT fk_producto_garantia FOREIGN KEY (id_garantia) REFERENCES GARANTIA(id_garantia),
    CONSTRAINT fk_producto_oferta FOREIGN KEY (id_oferta) REFERENCES OFERTA(id_oferta) ON DELETE SET NULL,

    CONSTRAINT ck_precio CHECK(precio >= 1000),
    CONSTRAINT ck_stock CHECK(stock >= 0),
    CONSTRAINT ck_cantidad_vendida CHECK(cantidad_vendida >= 0),
    CONSTRAINT ck_precio_descuento CHECK(precio_descuento >= 0),
    CONSTRAINT ck_rating CHECK(rating BETWEEN 0.0 AND 5.0),
    CONSTRAINT ck_cantidad_resenas CHECK(cantidad_resenas >= 0)
);

CREATE TABLE IF NOT EXISTS IMAGEN (

    id_imagen SERIAL NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL UNIQUE,
    id_producto SERIAL NOT NULL,

    CONSTRAINT pk_imagen PRIMARY KEY (id_imagen),
    CONSTRAINT fk_imagen_producto FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto)
);

CREATE TABLE IF NOT EXISTS RESENA (

    id_resena SERIAL NOT NULL,
    comentario VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario SERIAL NOT NULL,
    id_producto SERIAL NOT NULL,

    CONSTRAINT pk_resena PRIMARY KEY (id_resena),
    CONSTRAINT fk_resena_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
    CONSTRAINT fk_resena_producto FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto),

    CONSTRAINT ck_rating CHECK(rating BETWEEN 0 AND 5)
);

CREATE TABLE IF NOT EXISTS CARRITO (

    id_carrito_usuario SERIAL NOT NULL,
    precio_total INTEGER NOT NULL DEFAULT 0,
    cantidad_total INTEGER NOT NULL DEFAULT 0,
    productos_totales INTEGER NOT NULL DEFAULT 0,
    precio_descuento INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT pk_carrito_usuario PRIMARY KEY (id_carrito_usuario),
    CONSTRAINT fk_carrito_usuario_usuario FOREIGN KEY (id_carrito_usuario) REFERENCES USUARIO(id_usuario),

    CONSTRAINT ck_precio_total CHECK(precio_total >= 0),
    CONSTRAINT ck_cantidad_total CHECK(cantidad_total >= 0),
    CONSTRAINT ck_productos_totales CHECK(productos_totales >= 0),
    CONSTRAINT ck_precio_descuento CHECK(precio_descuento >= 0)
);

CREATE TABLE IF NOT EXISTS ITEM (

    id_item SERIAL NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario INTEGER NOT NULL,
    id_carrito_usuario SERIAL NOT NULL,
    id_producto SERIAL NOT NULL,

    CONSTRAINT pk_item PRIMARY KEY (id_item),
    CONSTRAINT fk_item_carrito FOREIGN KEY (id_carrito_usuario) REFERENCES CARRITO(id_carrito_usuario),
    CONSTRAINT fk_item_producto FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto),

    CONSTRAINT ck_cantidad CHECK(cantidad >= 1),
    CONSTRAINT ck_precio CHECK(precio_unitario >= 1000)
);

CREATE TABLE IF NOT EXISTS SUCURSAL (

    id_sucursal SERIAL NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    nombre_comercial VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10) NOT NULL,
    telefono VARCHAR(12) NOT NULL,
    email VARCHAR(255) NOT NULL,
    fecha_apertura DATE NOT NULL,
    capacidad_maxima INTEGER NOT NULL,
    capacidad_ocupada INTEGER NOT NULL DEFAULT 0,
    condicion VARCHAR(100) NOT NULL,
    id_direccion SERIAL NOT NULL,
    UNIQUE (nombre, nombre_comercial),

    CONSTRAINT pk_sucursal PRIMARY KEY (id_sucursal),
    CONSTRAINT fk_sucursal_direccion FOREIGN KEY (id_direccion) REFERENCES DIRECCION(id_direccion),

    CONSTRAINT ck_telefono_sucursal CHECK(telefono ~ '^\+569\d{8}$'),
    CONSTRAINT ck_capacidad_maxima CHECK(capacidad_maxima >= 0),
    CONSTRAINT ck_capacidad_ocupada CHECK(capacidad_ocupada >= 0)
);

CREATE TABLE IF NOT EXISTS SUCURSAL_PRODUCTO (

    id_sucursal_producto SERIAL NOT NULL,
    cantidad INTEGER NOT NULL,
    id_sucursal SERIAL NOT NULL,
    id_producto SERIAL NOT NULL,

    CONSTRAINT pk_sucursal_producto PRIMARY KEY (id_sucursal_producto),
    CONSTRAINT fk_sucursal_producto_sucursal FOREIGN KEY (id_sucursal) REFERENCES SUCURSAL(id_sucursal),
    CONSTRAINT fk_sucursal_producto_producto FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto),

    CONSTRAINT ck_stock_sucursal CHECK(cantidad >= 1)
);

CREATE TABLE IF NOT EXISTS EMPLEADO (
    
    id_empleado SERIAL NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(12) NOT NULL,
    genero tipo_genero NOT NULL,
    edad INTEGER NOT NULL,
    rut VARCHAR(12) NOT NULL,
    salario INTEGER NOT NULL,
    condicion VARCHAR(100) NOT NULL,
    puesto VARCHAR(100) NOT NULL,
    fecha_contrato DATE NOT NULL,
    fecha_termino DATE NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_sucursal SERIAL NOT NULL,
    UNIQUE (email, rut),

    CONSTRAINT pk_empleado PRIMARY KEY (id_empleado),
    CONSTRAINT fk_empleado_sucursal FOREIGN KEY (id_sucursal) REFERENCES SUCURSAL(id_sucursal),

    CONSTRAINT ck_telefono_empleado CHECK(telefono ~ '^\+569\d{8}$'),
    CONSTRAINT ck_rut CHECK(rut ~ '^\d{7,8}-[0-9kK]$'),
    CONSTRAINT ck_edad CHECK(edad >= 18),
    CONSTRAINT ck_salario CHECK(salario >= 300000),
    CONSTRAINT ck_fecha_termino CHECK(fecha_termino > fecha_contrato)
);

CREATE TABLE IF NOT EXISTS VENTA (

    id_venta SERIAL NOT NULL,
    codigo_venta UUID NOT NULL UNIQUE,
    fecha_venta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    precio_neto INTEGER NOT NULL,
    precio_iva INTEGER NOT NULL,
    precio_total INTEGER NOT NULL,
    descuento_aplicado INTEGER NOT NULL,
    cantidad_productos INTEGER NOT NULL,
    estado tipo_estado_venta NOT NULL,
    tipo_entrega tipo_entrega NOT NULL,
    id_sucursal SERIAL NOT NULL,
    id_usuario SERIAL NOT NULL,

    CONSTRAINT pk_venta PRIMARY KEY (id_venta),
    CONSTRAINT fk_venta_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
    CONSTRAINT fk_venta_sucursal FOREIGN KEY (id_sucursal) REFERENCES SUCURSAL(id_sucursal),

    CONSTRAINT ck_precio_total CHECK(precio_total >= 0),
    CONSTRAINT ck_descuento_aplicado CHECK(descuento_aplicado >= 0),
    CONSTRAINT ck_cantidad_productos CHECK(cantidad_productos >= 0),
    CONSTRAINT ck_precio_neto CHECK(precio_neto >= 0),
    CONSTRAINT ck_precio_iva CHECK(precio_iva >= 0)
);

CREATE TABLE IF NOT EXISTS VENTA_PRODUCTO (

    id_venta_producto SERIAL NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario INTEGER NOT NULL,
    id_venta SERIAL NOT NULL,
    id_producto SERIAL NOT NULL,

    CONSTRAINT pk_venta_producto PRIMARY KEY (id_venta_producto),
    CONSTRAINT fk_venta_producto_venta FOREIGN KEY (id_venta) REFERENCES VENTA(id_venta),
    CONSTRAINT fk_venta_producto_producto FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto),

    CONSTRAINT ck_cantidad CHECK(cantidad >= 1),
    CONSTRAINT ck_precio CHECK(precio_unitario >= 1000)
);

CREATE TABLE IF NOT EXISTS ENVIO (

    id_envio SERIAL NOT NULL,
    numero_seguimiento VARCHAR(20) NOT NULL UNIQUE,
    informacion_envio VARCHAR(255) NOT NULL,
    fecha_envio TIMESTAMP NOT NULL,
    fecha_entrega TIMESTAMP NOT NULL,
    precio_envio INTEGER NOT NULL,
    estado tipo_estado_envio NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_venta SERIAL NOT NULL,
    id_sucursal SERIAL NOT NULL,

    CONSTRAINT pk_envio PRIMARY KEY (id_envio),
    CONSTRAINT fk_envio_venta FOREIGN KEY (id_venta) REFERENCES VENTA(id_venta),
    CONSTRAINT fk_envio_sucursal FOREIGN KEY (id_sucursal) REFERENCES SUCURSAL(id_sucursal),

    CONSTRAINT ck_precio_envio CHECK(precio_envio >= 0),
    CONSTRAINT ck_fecha_entrega CHECK(fecha_entrega > fecha_envio),
    CONSTRAINT ck_numero_seguimiento CHECK(LENGTH(numero_seguimiento) = 20)
);

CREATE TABLE IF NOT EXISTS PROVEEDOR (

    id_proveedor SERIAL NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefono VARCHAR(12) NOT NULL,
    rut VARCHAR(12) NOT NULL UNIQUE,
    direccion VARCHAR(255) NOT NULL,
    rating DECIMAL(3, 2) NOT NULL DEFAULT 0.0,
    sitio_web VARCHAR(255) NULL,
    id_direccion SERIAL NOT NULL,

    CONSTRAINT pk_proveedor PRIMARY KEY (id_proveedor),
    CONSTRAINT fk_proveedor_direccion FOREIGN KEY (id_direccion) REFERENCES DIRECCION(id_direccion),

    CONSTRAINT ck_telefono_proveedor CHECK(telefono ~ '^\+569\d{8}$'),
    CONSTRAINT ck_rut_proveedor CHECK(rut ~ '^\d{7,8}-[0-9kK]$'),
    CONSTRAINT ck_rating_proveedor CHECK(rating BETWEEN 0.0 AND 5.0),
    CONSTRAINT ck_sitio_web_proveedor CHECK(sitio_web ~ '^(http|https)://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')
);

CREATE TABLE IF NOT EXISTS COMPRA (

    id_compra SERIAL NOT NULL,
    numero_factura VARCHAR(20) NOT NULL UNIQUE,
    fecha_compra TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    precio_neto INTEGER NOT NULL,
    precio_iva INTEGER NOT NULL,
    precio_total INTEGER NOT NULL,
    cantidad_productos INTEGER NOT NULL,
    estado tipo_estado_venta NOT NULL,
    metodo_pago tipo_metodo_pago NOT NULL,
    id_empleado SERIAL NOT NULL,
    id_proveedor SERIAL NOT NULL,

    CONSTRAINT pk_compra PRIMARY KEY (id_compra),
    CONSTRAINT fk_compra_empleado FOREIGN KEY (id_empleado) REFERENCES EMPLEADO(id_empleado),
    CONSTRAINT fk_compra_proveedor FOREIGN KEY (id_proveedor) REFERENCES PROVEEDOR(id_proveedor),

    CONSTRAINT ck_precio_total CHECK(precio_total >= 0),
    CONSTRAINT ck_cantidad_productos CHECK(cantidad_productos >= 0),
    CONSTRAINT ck_precio_neto CHECK(precio_neto >= 0),
    CONSTRAINT ck_precio_iva CHECK(precio_iva >= 0),
    CONSTRAINT ck_numero_factura CHECK(LENGTH(numero_factura) = 20)
);

CREATE TABLE IF NOT EXISTS COMPRA_PRODUCTO (

    id_compra_producto SERIAL NOT NULL,
    cantidad INTEGER NOT NULL,
    id_compra SERIAL NOT NULL,
    id_producto SERIAL NOT NULL,

    CONSTRAINT pk_compra_producto PRIMARY KEY (id_compra_producto),
    CONSTRAINT fk_compra_producto_compra FOREIGN KEY (id_compra) REFERENCES COMPRA(id_compra),
    CONSTRAINT fk_compra_producto_producto FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto),

    CONSTRAINT ck_cantidad CHECK(cantidad >= 1)
);

CREATE TABLE IF NOT EXISTS ORDEN_COMPRA (

    id_orden_compra SERIAL NOT NULL,
    numero_orden VARCHAR(20) NOT NULL UNIQUE,
    fecha_orden TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega TIMESTAMP NOT NULL,
    estodo tipo_estado_envio NOT NULL,
    id_sucursal SERIAL NOT NULL,

    CONSTRAINT pk_orden_compra PRIMARY KEY (id_orden_compra),
    CONSTRAINT fk_orden_compra_sucursal FOREIGN KEY (id_sucursal) REFERENCES SUCURSAL(id_sucursal),
    CONSTRAINT fk_orden_compra_compra FOREIGN KEY (id_orden_compra) REFERENCES COMPRA(id_compra),

    CONSTRAINT ck_numero_orden CHECK(LENGTH(numero_orden) = 20)
);

CREATE TABLE IF NOT EXISTS PUBLICACION (

    id_publicacion SERIAL NOT NULL,
    titulo VARCHAR(255) NOT NULL UNIQUE,
    contenido TEXT NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
    dislikes INTEGER NOT NULL DEFAULT 0,
    publicado BOOLEAN NOT NULL DEFAULT false,
    vistas INTEGER NOT NULL DEFAULT 0,
    fecha_publicacion DATE NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario SERIAL NOT NULL,

    CONSTRAINT pk_publicacion PRIMARY KEY (id_publicacion),
    CONSTRAINT fk_publicacion_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,

    CONSTRAINT ck_likes CHECK(likes >= 0),
    CONSTRAINT ck_dislikes CHECK(dislikes >= 0),
    CONSTRAINT ck_vistas CHECK(vistas >= 0)
);

CREATE TABLE IF NOT EXISTS COMENTARIO (

    id_comentario SERIAL NOT NULL,
    contenido VARCHAR(500) NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario SERIAL NOT NULL,
    id_publicacion SERIAL NOT NULL,

    CONSTRAINT pk_comentario PRIMARY KEY (id_comentario),
    CONSTRAINT fk_comentario_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_comentario_publicacion FOREIGN KEY (id_publicacion) REFERENCES PUBLICACION(id_publicacion) ON DELETE CASCADE,

    CONSTRAINT ck_likes_comentario CHECK(likes >= 0)
);

CREATE TABLE IF NOT EXISTS TAG (

    id_tag SERIAL NOT NULL,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT NULL,

    CONSTRAINT pk_tag PRIMARY KEY (id_tag)
);

CREATE TABLE IF NOT EXISTS PUBLICACION_TAG (

    id_publicacion_tag SERIAL NOT NULL,
    id_publicacion SERIAL NOT NULL,
    id_tag SERIAL NOT NULL,

    CONSTRAINT pk_publicacion_tag PRIMARY KEY (id_publicacion_tag),
    CONSTRAINT fk_publicacion_tag_publicacion FOREIGN KEY (id_publicacion) REFERENCES PUBLICACION(id_publicacion) ON DELETE CASCADE,
    CONSTRAINT fk_publicacion_tag_tag FOREIGN KEY (id_tag) REFERENCES TAG(id_tag) ON DELETE CASCADE
);