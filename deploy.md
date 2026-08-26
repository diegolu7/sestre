# Deploy — Local + GitHub Pages

El proyecto debe quedar preparado para funcionar correctamente tanto en desarrollo local como en **GitHub Pages**, sin romper rutas, imágenes, assets, navegación ni archivos generados durante el build.

Repositorio:

```text
git@github.com:diegolu7/sestre.git
```

URL esperada de GitHub Pages:

```text
https://diegolu7.github.io/sestre/
```

El repositorio ya tiene configurado:

```text
Settings → Pages → Build and deployment → GitHub Actions
```

Astro recomienda configurar `site`, `base` y utilizar su GitHub Action oficial para proyectos publicados bajo `https://usuario.github.io/repositorio/`.

---

## Configuración de Astro

Configurar `astro.config.mjs` teniendo en cuenta que el proyecto se publica dentro del subdirectorio:

```text
/sestre/
```

Ejemplo:

```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  site: "https://diegolu7.github.io",
  base: "/sestre",
  integrations: [react()],
  vite: {
    plugins: [tailwind()],
  },
});
```

Si la configuración real de Tailwind o React ya existe, conservarla y añadir únicamente lo necesario para GitHub Pages.

Los valores obligatorios son:

```js
site: 'https://diegolu7.github.io',
base: '/sestre',
```

---

# Assets y rutas compatibles con ambos entornos

Este punto es obligatorio.

El sitio debe funcionar correctamente tanto en:

```text
npm run dev
```

como en:

```text
https://diegolu7.github.io/sestre/
```

No utilizar rutas absolutas hardcodeadas como:

```html
<img src="/mujer_hero.png" />
<img src="/background_hero.png" />
<img src="/sestre_logo.png" />
```

porque asumir que `/` es siempre la raíz del dominio puede romper los assets al publicar el sitio dentro de `/sestre/`.

---

## Estrategia recomendada para los PNG

Los archivos inicialmente disponibles en la raíz:

```text
background_hero.png
mujer_hero.png
sestre_logo.png
```

deben trasladarse durante la organización del proyecto preferentemente a:

```text
src/assets/
```

Ejemplo:

```text
src/
├── assets/
│   ├── background_hero.png
│   ├── mujer_hero.png
│   └── sestre_logo.png
```

Luego importarlos mediante Astro:

```astro
---
import backgroundHero from '../assets/background_hero.png';
import mujerHero from '../assets/mujer_hero.png';
import sestreLogo from '../assets/sestre_logo.png';
---
```

y utilizarlos mediante sus imports:

```astro
<img src={sestreLogo.src} alt="Sestre" />

<img
  src={backgroundHero.src}
  alt=""
  aria-hidden="true"
/>

<img
  src={mujerHero.src}
  alt="Modelo de Sestre"
/>
```

Esta estrategia debe priorizarse porque permite que Astro gestione correctamente las rutas y assets durante el build.

---

## Assets dentro de `public/`

Si algún recurso necesita permanecer dentro de:

```text
public/
```

no asumir que el sitio se encuentra desplegado en `/`.

Utilizar el base path de Astro cuando sea necesario:

```astro
---
const base = import.meta.env.BASE_URL;
---

<img src={`${base}sestre_logo.png`} alt="Sestre" />
```

La implementación debe evitar rutas que funcionen localmente pero fallen en GitHub Pages.

---

# Navegación interna

Para navegación dentro de la misma landing pueden utilizarse anchors relativos:

```html
<a href="#catalogo">Catálogo</a>
<a href="#nuevos-ingresos">Nuevos ingresos</a>
<a href="#contacto">Contacto</a>
```

Esto evita dependencias innecesarias de `/sestre/` para el scroll interno.

No utilizar:

```html
<a href="/#catalogo"></a>
```

porque `/` representa el dominio raíz y no necesariamente `/sestre/`.

---

# GitHub Actions

Crear:

```text
.github/workflows/deploy.yml
```

utilizando el flujo oficial recomendado para Astro + GitHub Pages.

Ejemplo:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v5

      - name: Install, build and upload Astro site
        uses: withastro/action@v5

  deploy:
    needs: build

    permissions:
      pages: write
      id-token: write

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    runs-on: ubuntu-latest

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

No implementar un deploy manual de `/dist` si la Action oficial de Astro ya administra build y artifact.

---

# Lockfile

El repositorio debe incluir el lockfile correspondiente al package manager utilizado.

Si se utiliza npm:

```text
package-lock.json
```

Debe quedar versionado en Git.

No añadirlo a `.gitignore`.

La GitHub Action oficial de Astro utiliza el lockfile para detectar correctamente el package manager.

---

# Scripts

Verificar que `package.json` permita como mínimo:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

---

# Verificación local obligatoria

Antes de considerar finalizada la tarea ejecutar:

```bash
npm install
npm run dev
```

Verificar:

- Hero.
- `sestre_logo.png`.
- `background_hero.png`.
- `mujer_hero.png`.
- imágenes de productos.
- navegación.
- modal.
- WhatsApp.
- responsive.
- consola sin errores.

---

## Verificación de producción local

También ejecutar:

```bash
npm run build
```

El comando debe finalizar correctamente y generar:

```text
/dist
```

Después ejecutar:

```bash
npm run preview
```

La versión de preview debe comprobarse porque representa mejor el resultado final del build.

No considerar terminada la tarea solamente porque `npm run dev` funciona.

---

# Verificación específica de rutas

Antes de finalizar comprobar que ninguna implementación relevante dependa incorrectamente de rutas absolutas como:

```text
/
/images/...
/assets/...
/mujer_hero.png
/background_hero.png
/sestre_logo.png
```

Buscar especialmente en:

```text
.astro
.ts
.tsx
.js
.css
.json
```

Las imágenes y assets deben funcionar tanto con:

```text
localhost
```

como bajo:

```text
/sestre/
```

---

# Deploy

Una vez que:

```bash
npm run build
```

termine sin errores y la versión local funcione correctamente:

```bash
git add .
git commit -m "Deploy Sestre landing"
git push origin main
```

El push a `main` debe ejecutar automáticamente GitHub Actions.

Una vez completado correctamente el workflow, el sitio debe quedar disponible en:

```text
https://diegolu7.github.io/sestre/
```

---

# Criterios de aceptación del deploy

La tarea no se considera terminada hasta verificar:

- `npm run dev` funciona.
- `npm run build` funciona.
- `npm run preview` funciona.
- GitHub Actions completa correctamente.
- GitHub Pages carga correctamente.
- El Hero mantiene su composición.
- `sestre_logo.png` carga correctamente.
- `background_hero.png` carga correctamente.
- `mujer_hero.png` carga correctamente.
- Las imágenes del catálogo cargan correctamente.
- No existen errores 404 de assets.
- Los anchors funcionan.
- Los modales funcionan.
- Los CTAs de WhatsApp funcionan.
- Mobile funciona correctamente.
- Desktop funciona correctamente.
- No existen errores importantes en consola.

La implementación final debe ser compatible simultáneamente con:

```text
Local:
Astro dev / Astro preview

Producción:
https://diegolu7.github.io/sestre/
```

**No solucionar GitHub Pages rompiendo el desarrollo local, ni solucionar local utilizando rutas que fallen bajo `/sestre/`.**
