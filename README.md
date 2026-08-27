# Sestre Showroom

Landing page para Sestre, showroom de indumentaria femenina plus size en Embarcación y Salta. Una sola página, orientada a conversión: la usuaria explora el catálogo, abre el detalle de una prenda en un modal y consulta directamente por WhatsApp.

Sitio en producción: https://diegolu7.github.io/sestre/

## Qué tiene

- Hero con los assets oficiales (fondo + modelo) manteniendo la composición aprobada.
- Sección de Nuevos ingresos con carrusel horizontal (flechas en desktop, swipe en mobile).
- Catálogo completo con filtros por categoría.
- Modal de producto (imagen, galería, talles, calce, descripción y botón de WhatsApp).
- Mensajes de WhatsApp generados por producto, con el talle seleccionado cuando corresponde.
- Mobile menu, sticky bottom nav y diseño responsive para desktop/tablet/mobile.

## Stack

- [Astro](https://astro.build) + TypeScript (build estático)
- React solo para lo que lo necesita: modal, menú mobile (vía islas)
- Tailwind CSS v4, con los tokens de `design.json`
- Framer Motion para las animaciones del modal y el menú
- Lucide para los íconos

## Cómo está organizada la data

Los tres archivos JSON del root son la fuente de verdad y no deberían tocarse entre sí:

- `info.json` — contenido general del sitio (textos, nav, contacto, SEO). No modificar.
- `design.json` — sistema visual (paleta, tipografía, radios, espaciados). No modificar.
- `products.json` — **la fuente única del catálogo**. Acá se agregan, quitan o editan prendas.

La regla es simple: si un producto vive en `info.json` como ejemplo, se ignora. `products.json` manda.

Cada producto soporta estos campos:

```json
{
  "id": "vestido-cruzado",
  "name": "Vestido Cruzado",
  "price": "$45.900",
  "image": "products/vestido-cruzado.webp",
  "images": ["products/vestido-cruzado.webp", "products/vestido-cruzado-dorso.webp"],
  "sizes": ["XL", "XXL", "3XL"],
  "fit_information": "Consultar busto, cintura y largo",
  "description": "Opcional",
  "category": "Vestidos",
  "is_new": true
}
```

Algunas notas:

- Las imágenes de productos van en `public/products/` y en el JSON se guarda la ruta **sin** la barra inicial (ej. `products/vestido-cruzado.webp`), no `/products/...`.
- `is_new: true` hace que la prenda aparezca en Nuevos ingresos (además de en el catálogo). `is_new: false` solo en el catálogo.
- Si una prenda no tiene imagen válida, o la imagen falla al cargar, se muestra `src/assets/placeholder.png` automáticamente.

## Cómo lo levanto en local

Requisitos: Node.js 18 o superior y npm.

```bash
# 1. Parado en la raíz del proyecto
npm install

# 2. Servidor de desarrollo
npm run dev
```

Después abrí `http://localhost:4321/sestre/` en el navegador (el puerto puede variar si el 4321 está ocupado; Astro te avisa).

Para probar la versión "de producción" de forma local:

```bash
npm run build     # genera la carpeta dist/
npm run preview   # sirve el build en local
```

`preview` es importante: representa mejor lo que se publica que el dev server.

## Cómo agrego una prenda

1. Poné la imagen en `public/products/` (formato `.webp` idealmente).
2. Agregá el producto a `products.json` con su `id`, `name`, `price`, `image`, `category` y `is_new`.
3. Si no tiene imagen todavía, no la pongas: va a salir el placeholder.
4. Commit y push. GitHub Actions compila y publica en GitHub Pages automáticamente. No hace falta tocar código.

## Deploy

El push a `main` dispara el workflow `.github/workflows/deploy.yml` (acción oficial de Astro). Configuración en `astro.config.mjs`:

```js
site: "https://diegolu7.github.io",
base: "/sestre",
```

Ojo con las rutas: el sitio vive bajo `/sestre/`, así que las imágenes y assets usan el base path de Astro (`import.meta.env.BASE_URL`). No hardcodear `/` en rutas de assets.

## Notas

- La sección "Guía de talles" que existe en `info.json` **no** se renderiza a propósito (el proyecto la ignora).
- Los talles de las prendas se muestran cuando `sizes` está presente; si no, no se inventa nada y se muestra la info de calce si la hay.
