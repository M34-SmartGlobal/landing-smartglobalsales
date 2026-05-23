# Smart Global Sales - Corporate Landing & Recruitment Portal

![Next.js](https://img.shields.io/badge/Next.js-App%20Router-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111111)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%7C%20Auth%20%7C%20Storage-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)

## 📌 Descripción

**Smart Global Sales - Corporate Landing & Recruitment Portal** es una plataforma web corporativa y sistema de captación de talento con formularios dinámicos, gestión de leads y un panel administrativo protegido.

El proyecto funciona como una **landing page de alta conversión** para postulantes y contactos, acompañada de un **CMS ligero** construido a medida para administrar banners, noticias, puestos laborales, sedes, campañas visuales y configuraciones globales.

---

## 🧰 Stack Tecnológico

- **Next.js App Router**: arquitectura moderna basada en Server Components y rutas protegidas.
- **React**: componentes reutilizables para landing y panel administrativo.
- **Tailwind CSS**: sistema visual responsive, mobile-first y basado en tokens de marca.
- **Framer Motion**: transiciones suaves, modales y microinteracciones fluidas.
- **Lucide React**: iconografía limpia para navegación, acciones e interfaz.
- **Supabase**:
  - PostgreSQL como base de datos relacional.
  - Supabase Auth para acceso administrativo.
  - Supabase Storage para imágenes de banners, campañas y noticias.
  - Row Level Security para proteger datos y archivos.
- **Vercel**: despliegue optimizado para aplicaciones Next.js.

---

## ✨ Características Principales

### 🌐 Frontend Dinámico

- Hero moderno con formulario de postulación integrado.
- Banners administrables desde Supabase.
- Sección **Nosotros** con slider dinámico de imágenes.
- Sección **Servicios** editable desde configuración global.
- Sección **Últimas Noticias** con tarjetas y modal de lectura.
- Carrusel infinito de campañas/logos con `mask-image` para efecto de desvanecimiento lateral.
- Header sticky con TopBar, datos de contacto y redes sociales administrables.
- Footer con textos legales dinámicos en modales.

### 🧑‍💼 Sistema de Reclutamiento

- Formulario de postulación conectado a puestos laborales reales.
- Selects dinámicos para:
  - Puestos de trabajo.
  - Sedes activas.
- Consentimiento obligatorio de tratamiento de datos personales.
- Registro de postulantes en Supabase.

### 📩 Gestión de Contactos

- Formulario de contacto con fuente de descubrimiento.
- Registro de leads comerciales en Supabase.
- Exportación CSV desde el panel admin.

### 🔐 Panel de Administración Seguro

Rutas protegidas bajo `/admin` con Supabase Auth:

- `/admin/leads`: gestión de postulaciones y contactos.
- `/admin/banners`: CRUD de banners/hero con carga de imágenes.
- `/admin/campaigns`: gestión de logos para carrusel infinito.
- `/admin/jobs`: CRUD de puestos de trabajo.
- `/admin/news`: CRUD de noticias con imagen, extracto y contenido completo.
- `/admin/locations`: CRUD de sedes.
- `/admin/legal`: edición de textos legales.
- `/admin/settings`: configuración global de contacto, redes sociales y servicios.

### 🛡️ Seguridad RLS

- Políticas de **Row Level Security** para tablas públicas y privadas.
- Lectura pública solo para contenido activo.
- Escritura, actualización y eliminación restringidas a administradores autenticados.
- Buckets de Storage con permisos diferenciados para lectura pública y escritura admin.

### 📱 Mobile-First

- Diseño responsive optimizado para conversiones.
- Header y Footer adaptados a pantallas pequeñas.
- Formularios accesibles y usables desde móvil.
- `scrollbar-gutter: stable` para evitar layout shift al abrir modales.

---

## 🗂️ Estructura del Proyecto

```txt
landing-smart/
├── app/
│   ├── admin/
│   │   ├── banners/
│   │   ├── campaigns/
│   │   ├── jobs/
│   │   ├── leads/
│   │   ├── legal/
│   │   ├── locations/
│   │   ├── news/
│   │   └── settings/
│   ├── login/
│   ├── globals.css
│   ├── icon.tsx
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── admin/
│   │   ├── banner-manager.tsx
│   │   ├── campaign-logo-manager.tsx
│   │   ├── jobs-manager.tsx
│   │   ├── leads-table.tsx
│   │   ├── locations-manager.tsx
│   │   ├── news-manager.tsx
│   │   └── settings-manager.tsx
│   │
│   ├── landing/
│   │   ├── about-section.tsx
│   │   ├── application-form.tsx
│   │   ├── campaign-marquee.tsx
│   │   ├── contact-form.tsx
│   │   ├── footer-legal.tsx
│   │   ├── hero-section.tsx
│   │   ├── news-section.tsx
│   │   ├── services-section.tsx
│   │   └── site-header.tsx
│   │
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       └── select.tsx
│
├── lib/
│   ├── actions/
│   │   ├── admin.ts
│   │   ├── auth.ts
│   │   └── landing.ts
│   ├── supabase/
│   │   ├── browser.ts
│   │   ├── middleware.ts
│   │   └── server.ts
│   └── utils/
│       ├── cn.ts
│       └── csv.ts
│
├── public/
│   └── smart-global-logo.jpg
│
├── recursos/
│   ├── VER1_8711f10e.jpg
│   └── VER2_28ed3f02.jpg
│
├── supabase/
│   └── sql/
│       └── *.sql
│
├── middleware.ts
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### 📁 Directorios clave

- `app/`: rutas públicas, login y panel administrativo.
- `components/landing/`: componentes de la landing corporativa.
- `components/admin/`: módulos interactivos del CMS/panel admin.
- `components/ui/`: componentes base reutilizables.
- `lib/actions/`: Server Actions y consultas a Supabase.
- `lib/supabase/`: clientes Supabase para browser, server y middleware.
- `supabase/sql/`: scripts SQL para tablas, buckets y políticas RLS.

---

## 🚀 Getting Started

### 1. Requisitos Previos

Antes de iniciar, asegúrate de tener instalado:

- Node.js 20 o superior.
- npm.
- Cuenta y proyecto activo en Supabase.
- Opcional: cuenta en Vercel para despliegue.

---

### 2. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd landing-smart
```

---

### 3. Instalar Dependencias

```bash
npm install
```

---

### 4. Configurar Variables de Entorno

Crea el archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_opcional
```

Variables principales:

- `NEXT_PUBLIC_SUPABASE_URL`: URL pública del proyecto Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: clave pública anon para cliente y Server Actions.
- `SUPABASE_SERVICE_ROLE_KEY`: reservada para operaciones server-side avanzadas si se requiere.

---

### 5. Ejecutar el Servidor Local

```bash
npm run dev
```

Abre el navegador en:

```txt
http://localhost:3000
```

Panel administrativo:

```txt
http://localhost:3000/login
```

---

## 🗄️ Base de Datos y Supabase

Los scripts necesarios se encuentran en:

```txt
supabase/sql/
```

Ejecuta los scripts desde el **SQL Editor de Supabase** antes de usar el proyecto en local o producción.

Estos scripts inicializan y actualizan:

- `profiles`: perfiles de usuarios admin.
- `application_leads`: postulantes.
- `contact_leads`: contactos comerciales.
- `campaigns`: logos/campañas para carrusel.
- `job_positions`: puestos laborales dinámicos.
- `locations`: sedes disponibles.
- `site_banners`: banners administrables para la landing.
- `news_articles`: noticias con imagen, extracto y contenido completo.
- `legal_contents`: textos legales dinámicos.
- `site_settings`: configuración global del sitio.

También configuran:

- Buckets de Storage:
  - `campaign-logos`
  - `site-banners`
  - `news-images`
- Políticas RLS para lectura pública y escritura administrativa.
- Función `public.is_admin()` para validación de permisos.

### 🔑 Primer Administrador

Después de crear el usuario en Supabase Auth, asígnale rol admin desde SQL:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id
  from auth.users
  where email = 'admin@smartglobalsales.com'
  limit 1
);
```

---

## 🧪 Scripts Disponibles

```bash
npm run dev
```

Inicia el entorno local de desarrollo.

```bash
npm run build
```

Genera el build de producción.

```bash
npm run start
```

Ejecuta el build de producción localmente.

```bash
npm run lint
```

Ejecuta ESLint para verificar calidad del código.

---

## ☁️ Despliegue en Vercel

El proyecto está optimizado para desplegarse en **Vercel**.

Pasos recomendados:

1. Sube el repositorio a GitHub.
2. Importa el proyecto desde Vercel.
3. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`, si aplica.
4. Ejecuta el deploy.

Vercel detectará automáticamente Next.js y ejecutará:

```bash
npm run build
```

---

## 🔐 Seguridad

Este proyecto usa Supabase RLS para proteger operaciones críticas:

- Usuarios anónimos pueden insertar postulaciones/contactos.
- Usuarios anónimos solo pueden leer contenido activo.
- Administradores autenticados pueden gestionar CMS, leads y archivos.
- Storage restringe escritura, actualización y eliminación a usuarios admin.

---

## 📱 Responsive & UX

- Diseño Mobile-First.
- Header y TopBar adaptados a móvil.
- Formularios con validación accesible.
- Modales con `scrollbar-gutter: stable` para evitar layout shift.
- Animaciones suaves con Framer Motion.
- Carrusel infinito optimizado con CSS y `mask-image`.

---

## 🏢 Smart Global Sales

Plataforma construida para centralizar la presencia corporativa, captar postulantes, administrar contenido dinámico y gestionar leads desde un panel seguro, moderno y escalable.
