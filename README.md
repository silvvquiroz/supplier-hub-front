Supplier — Frontend de gestión de proveedores
=============================================

Resumen
-------

Aplicación frontend desarrollada con React y Vite para la gestión de proveedores. Proporciona interfaces para listar, crear y administrar proveedores y está preparada para ser construida y desplegada en entornos de producción.

Tecnologías principales
----------------------

- **Framework:** React
- **Bundler / Dev server:** Vite
- **Gestión de datos:** @tanstack/react-query
- **Validación de esquemas:** Zod

Estructura relevante del proyecto
---------------------------------

- `src/` — Código fuente de la aplicación (componentes, hooks, estilos).
- `public/` — Archivos estáticos servidos tal cual (fuentes, assets).
- `package.json` — Scripts de desarrollo y build.

Requisitos previos
------------------

- Node.js 18+ y npm o yarn instalados.
- Acceso a la API backend (si aplica) y credenciales necesarias.

Variables de entorno
--------------------

Se recomienda exponer la URL de la API y otras variables de entorno con el prefijo `VITE_`. Ejemplo de archivo `.env` en la raíz del proyecto:

```bash
VITE_API_URL=https://api.example.com
```

Instalación
-----------

Instalar dependencias:

```bash
npm install
# o
# yarn install
```

Scripts disponibles
-------------------

- `npm run dev` — Inicia el servidor de desarrollo (Vite) en modo local.
- `npm run build` — Genera una compilación optimizada en la carpeta `dist`.
- `npm run preview` — Sirve una vista previa de la carpeta `dist` para validar el build localmente.

Construcción para producción
----------------------------

1. Ajuste `VITE_API_URL` y otras variables en `.env` o en el entorno de CI.
2. Ejecutar:

```bash
npm run build
```

3. La salida optimizada se ubicará en `dist/` y está lista para ser servida por un servidor estático o plataforma de hosting.

Opciones de despliegue recomendadas
----------------------------------

- Plataformas orientadas a frontends estáticos: Vercel, Netlify o Cloudflare Pages — despliegue directo desde el repositorio y configuración de variables de entorno en la plataforma.
- Servidor estático (Nginx, Caddy): copiar contenido de `dist/` al servidor y configurar el host y reglas de caching.
- Contenerización (opcional): construir la app y servir `dist/` mediante una imagen ligera (por ejemplo, `nginx:alpine`) si el flujo de despliegue lo requiere.

Ejemplo rápido con `serve` para probar el build localmente:

```bash
npx serve -s dist
```

Consideraciones para producción
-------------------------------

- Habilitar compresión (gzip, brotli) en el servidor web.
- Configurar políticas de cache y expiración para assets estáticos.
- Proteger y rotar credenciales/variables de entorno en la plataforma de despliegue.
- Verificar CORS en el backend para permitir las peticiones desde el dominio de producción.

Mantenimiento y contacto
------------------------

Para cambios en dependencias o scripts revisar `package.json`. Para preguntas sobre el despliegue o integraciones con el backend, contactar al responsable del repositorio.

— Fin
