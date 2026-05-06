-- Tipos de identificacion
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

-- Reglas de negocio
ALTER TABLE mgm_pacientes
ADD CONSTRAINT chk_estado_paciente
CHECK (estado IN ('A','I'));

ALTER TABLE daf_tipos_identificacion
ADD CONSTRAINT chk_estado_tipo
CHECK (estado IN ('A','I'));

ALTER TABLE mgm_pacientes
ADD CONSTRAINT uq_numero_identificacion
UNIQUE (numero_identificacion);

-- Indices
CREATE INDEX idx_pacientes_identificacion
ON mgm_pacientes(numero_identificacion);

CREATE INDEX idx_pacientes_nombre
ON mgm_pacientes(nombre_completo);
