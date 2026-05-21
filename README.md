# GD — Plataforma Web para DJ Gustavo Delgadillo

Plataforma fullstack para la gestión de servicios, reservas y presencia digital del DJ Gustavo Delgadillo. El frontend ofrece una experiencia visual inmersiva con Three.js; el backend expone una API REST segura que centraliza toda la lógica de negocio.

---

## Visión general

GD es una solución completa para que un DJ profesional pueda gestionar su negocio desde un solo panel:

- Los clientes exploran servicios, consultan disponibilidad y hacen reservas directamente desde el sitio.
- Las reseñas pasan por un flujo de moderación antes de publicarse, garantizando que solo aparecen opiniones verificadas.
- El blog genera contenido que posiciona la marca y atrae nuevos clientes.
- Los leads capturados desde formularios de contacto entran a un pipeline de ventas gestionable desde el panel de administración.
- El catálogo de productos permite vender merchandising o equipamiento directamente desde el sitio.
- Todo el contenido multimedia se almacena en Cloudinary, sin ocupar espacio en el servidor.
- La integración con Mercado Pago está preparada y se activa cuando el negocio lo requiera.

---

## Stack

### Frontend
| Tecnología | Rol |
|---|---|
| React | UI y gestión de estado |
| Tailwind CSS | Estilos y diseño responsivo |
| Three.js | Experiencia visual 3D / inmersiva |

### Backend
| Tecnología | Rol |
|---|---|
| Node.js >= 22 | Runtime |
| Express 4 | Framework HTTP |
| MongoDB + Mongoose | Base de datos |
| JWT + bcryptjs | Autenticación y hashing |
| Cloudinary | Almacenamiento de imágenes |
| Mercado Pago | Pagos en línea (próximamente) |
| helmet, cors, express-rate-limit | Seguridad HTTP |

---

## Estructura del repositorio

```
/
├── Frontend/     ← React + Tailwind + Three.js
└── Backend/      ← API REST — Node.js + Express + MongoDB
```

---

## Reglas de negocio

### Servicios y reservas
- El DJ ofrece servicios con precio, duración y galería de imágenes.
- Los clientes consultan la disponibilidad de un servicio por mes antes de hacer una reserva.
- Las reservas inician en estado `pending` y el administrador las mueve a `confirmed`, `cancelled` o `completed`.
- El precio se congela en el momento de la reserva para mantener la integridad histórica.
- El estado de pago es independiente del estado de la reserva (`unpaid`, `pending`, `paid`, `refunded`).

### Reseñas
- Cualquier persona puede enviar una reseña desde el sitio público (máximo 3 por hora por IP).
- Toda reseña ingresa con estado `pending` y no se muestra hasta que un administrador la aprueba.
- El administrador puede aprobar o rechazar cada reseña desde el panel.
- El email del autor nunca se expone en el endpoint público.

### Blog
- Los posts pueden estar en borrador (`draft`) o publicados (`published`).
- El slug se genera automáticamente desde el título.
- La fecha de publicación se registra automáticamente al cambiar el estado a `published`.
- Solo se muestran posts publicados en el endpoint público.

### Leads (formulario de contacto)
- Los formularios de contacto crean leads con estado `new`.
- El administrador gestiona cada lead con un pipeline: `new` → `contacted` → `converted` / `lost`.
- Límite de 5 mensajes por hora por IP para evitar spam.

### Catálogo de productos
- Cada producto tiene galería de hasta 5 imágenes con una marcada como principal.
- Los productos inactivos no aparecen en el catálogo público.
- Al eliminar un producto, todas sus imágenes se borran de Cloudinary.

### Ventas
- Los items de una venta guardan un snapshot del nombre del producto al momento de la compra.
- El total se mantiene aunque el precio del producto cambie después.
- Métodos de pago soportados: Mercado Pago, efectivo, transferencia u otro.

### Configuración dinámica
- El sitio tiene pares clave-valor configurables sin necesidad de redesplegar.
- Las configs marcadas como `isPublic` se exponen en el endpoint público para que el frontend las consuma.

### Administración y roles
- Existen dos roles: `admin` y `superadmin`.
- Solo el `superadmin` puede eliminar configuraciones del sistema y registrar nuevos administradores en producción.
- Las cuentas de administrador pueden deshabilitarse sin eliminarse (`isActive: false`).
- En producción, el registro de admins requiere autenticación de superadmin; en desarrollo está abierto para facilitar la configuración inicial.

---

## Seguridad

- **helmet** — headers HTTP de seguridad en cada respuesta.
- **CORS estricto** — solo se acepta el origen definido en `CLIENT_URL`.
- **Rate limiting en tres niveles:** global (`/api`), autenticación (`/api/auth`), y formularios públicos (leads y reseñas).
- **Sanitización propia** — prevención de NoSQL injection, XSS y prototype pollution sin dependencias de terceros.
- **Validación propia** — esquemas por ruta sin librerías externas.
- **JWT + bcrypt** — tokens firmados, contraseñas hasheadas con factor de costo 12.
- **Uploads seguros** — validación de MIME type, límite de 5 MB por archivo, streaming directo a Cloudinary sin escribir en disco.
- **Webhook de Mercado Pago** — verificación de firma HMAC para garantizar autenticidad.

---

## Puesta en marcha (Backend)

### Requisitos
- Node.js >= 22
- MongoDB (local o Atlas)
- Cuenta de Cloudinary

### Instalación

```bash
# 1. Entrar al directorio
cd Backend

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de variables de entorno
cp .env.example .env
# → editar .env con tus credenciales

# 4. Cargar datos iniciales (superadmin + configs base)
npm run seed

# 5. Iniciar en desarrollo
npm run dev

# 6. Iniciar en producción
npm start
```

### Verificar que el servidor funciona

```
GET http://localhost:5000/api/health
→ { "status": "ok", "env": "development" }
```

---

## Variables de entorno

| Variable | Requerida | Descripción |
|---|---|---|
| `NODE_ENV` | Sí | `development` o `production` |
| `PORT` | No | Default: `5000` |
| `MONGODB_URI` | Sí | URI de conexión a MongoDB |
| `JWT_SECRET` | Sí | Clave larga y aleatoria para firmar tokens |
| `JWT_EXPIRES_IN` | No | Default: `7d` |
| `CLOUDINARY_CLOUD_NAME` | Sí | |
| `CLOUDINARY_API_KEY` | Sí | |
| `CLOUDINARY_API_SECRET` | Sí | |
| `CLIENT_URL` | Sí | URL del frontend (para CORS) |
| `MP_ACCESS_TOKEN` | No | Requerido al activar pagos |
| `MP_WEBHOOK_SECRET` | No | Requerido al activar pagos |
| `SEED_ADMIN_EMAIL` | No | Default: `admin@djgd.com` |
| `SEED_ADMIN_PASSWORD` | No | Default: `Admin1234!` |

---

## Autor

**Torres Mora Alan Giovanni**
