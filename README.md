📌 Prueba Técnica - Gestión de Pacientes

API REST desarrollada en Node.js + Express + TypeORM + Oracle Database.

Tecnologías
Node.js
Express
TypeORM
Oracle Database
JWT
Configuración del proyecto

Crear archivo .env:

DB_HOST=localhost
DB_PORT=1521
DB_SERVICE=XE
DB_USER=system
DB_PASSWORD=********

AUTH_USER=VERIS
AUTH_PASSWORD=********

JWT_SECRET=llave_secreta_para_jwt_prueba_tecnica_veris
JWT_EXPIRES=1h
Base de datos

La aplicación utiliza Oracle Database.

Requisitos
Tabla: MGM_PACIENTES
Tabla: DAF_TIPOS_IDENTIFICACION
Secuencia: MGM_SEQ_PACIENT
Script de base de datos
-- Tipos de identificación
CREATE TABLE daf_tipos_identificacion (
    codigo_tipo_identificacion VARCHAR2(10) PRIMARY KEY,
    nombre_tipo_identificacion VARCHAR2(50) NOT NULL,
    estado CHAR(1) DEFAULT 'A' NOT NULL
);

-- Pacientes
CREATE TABLE mgm_pacientes (
    id_paciente NUMBER PRIMARY KEY,
    codigo_tipo_identificacion VARCHAR2(10) NOT NULL,
    numero_identificacion VARCHAR2(20) NOT NULL,
    primer_nombre VARCHAR2(50) NOT NULL,
    segundo_nombre VARCHAR2(50),
    primer_apellido VARCHAR2(50) NOT NULL,
    segundo_apellido VARCHAR2(50),
    nombre_completo VARCHAR2(150) NOT NULL,
    email VARCHAR2(100) NOT NULL,
    estado CHAR(1) DEFAULT 'A' NOT NULL,
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_ingreso VARCHAR2(50),
    fecha_modificacion TIMESTAMP,
    usuario_modificacion VARCHAR2(50),
    CONSTRAINT fk_tipo_identificacion
    FOREIGN KEY (codigo_tipo_identificacion)
    REFERENCES daf_tipos_identificacion(codigo_tipo_identificacion)
);

-- Secuencia
CREATE SEQUENCE MGM_SEQ_PACIENT
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;
Reglas de negocio
ALTER TABLE mgm_pacientes
ADD CONSTRAINT chk_estado_paciente
CHECK (estado IN ('A','I'));

ALTER TABLE daf_tipos_identificacion
ADD CONSTRAINT chk_estado_tipo
CHECK (estado IN ('A','I'));

ALTER TABLE mgm_pacientes
ADD CONSTRAINT uq_numero_identificacion
UNIQUE (numero_identificacion);
Índices
CREATE INDEX idx_pacientes_identificacion
ON mgm_pacientes(numero_identificacion);

CREATE INDEX idx_pacientes_nombre
ON mgm_pacientes(nombre_completo);
Ejecución
npm install
npm run dev

Servidor:

http://localhost:3000
Autenticación
Login

POST /autenticacion/login

{
  "username": "VERIS",
  "password": "PRUEBAS123"
}
Endpoints
Crear paciente

POST /pacientes

Obtener paciente

GET /pacientes/{id}

Actualizar paciente

PUT /pacientes/{id}

Eliminar paciente (lógico)

DELETE /pacientes/{id}

Listar pacientes

GET /pacientes

Filtros:

numero_identificacion
nombre_completo
email
estado (default A)
page (default 1)
size (default 10)
Notas
ID generado por secuencia Oracle
Eliminación lógica (estado A/I)
Email validado
Búsquedas con LIKE
Todos los endpoints requieren JWT