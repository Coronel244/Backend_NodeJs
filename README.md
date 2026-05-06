# Prueba Tecnica - Gestion de Pacientes

API REST desarrollada en Node.js + Express + TypeORM + Oracle Database.

## Tecnologias

- Node.js
- Express
- TypeORM
- Oracle Database
- JWT

## Configuracion del proyecto

Crear archivo `.env`:

```env
DB_HOST=localhost
DB_PORT=1521
DB_SERVICE=XE
DB_USER=system
DB_PASSWORD=********

AUTH_USER=VERIS
AUTH_PASSWORD=********

JWT_SECRET=llave_secreta_para_jwt_prueba_tecnica_veris
JWT_EXPIRES=1h
```

## Base de datos

La aplicacion utiliza Oracle Database.

Requisitos:

- Tabla: `MGM_PACIENTES`
- Tabla: `DAF_TIPOS_IDENTIFICACION`
- Secuencia: `MGM_SEQ_PACIENT`

El script de creacion de tablas, secuencia, reglas de negocio e indices se encuentra en [sql/schema.sql](sql/schema.sql).

## Ejecucion

```bash
npm install
npm run dev
```

Servidor:

```text
http://localhost:3000
```

## Autenticacion

Login:

```http
POST /autenticacion/login
Authorization: Basic base64(username:password)
```

Ejemplo:

```bash
curl -X POST http://localhost:3000/autenticacion/login -H "Authorization: Basic VkVSSVM6UFJVRUVCQVMxMjM="
```

## Endpoints

Crear paciente:

```http
POST /pacientes
```

Obtener paciente:

```http
GET /pacientes/{id}
```

Actualizar paciente:

```http
PUT /pacientes/{id}
```

Eliminar paciente logico:

```http
DELETE /pacientes/{id}
```

Listar pacientes:

```http
GET /pacientes
```

Filtros:

- `numero_identificacion`
- `nombre_completo`
- `email`
- `estado` opcional: `A`/`I`; si no se envia trae ambos
- `page` default: `1`
- `size` default: `10`

## Notas

- ID generado por secuencia Oracle.
- Eliminacion logica con estado `A`/`I`.
- Email validado.
- Busquedas con `LIKE`.
- Todos los endpoints requieren JWT.
