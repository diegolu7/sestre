Reorganicé el prompt para que `info.json` siga definiendo el contenido general del sitio, pero **los productos ya no dependan de él**: `products.json` pasa a ser la única fuente de verdad del catálogo, nuevos ingresos, modales y mensajes de WhatsApp. Esto evita duplicaciones y permite actualizar el showroom simplemente modificando el JSON, agregando imágenes y haciendo deploy. En tu versión actual, catálogo y nuevos ingresos todavía dependen conceptualmente de `info.json`, así que esa es la corrección estructural principal.

# Sestre Showroom — Especificaciones de Desarrollo

> **Objetivo principal:** construir una landing page estática, moderna, responsive y orientada a conversión para **Sestre**, showroom de indumentaria femenina plus size.

El sitio debe funcionar como un **showroom digital**, donde las usuarias puedan:

- conocer la marca;
- descubrir prendas;
- explorar nuevos ingresos;
- abrir el detalle de cada producto sin abandonar la página;
- consultar directamente por WhatsApp.

El objetivo principal de conversión es:

# Prenda → interés → modal → WhatsApp

No implementar:

- carrito;
- checkout;
- cuentas de usuario;
- login;
- panel administrativo;
- páginas individuales de producto;
- flujo tradicional de e-commerce;
- backend;
- base de datos.

El proyecto será una landing estática administrada principalmente mediante archivos JSON.

---

# Archivos fuente del proyecto

En el directorio raíz estarán disponibles:

```text
/
├── info.json
├── products.json
├── design.json
├── background_hero.png
├── mujer_hero.png
├── sestre_logo.png
├── placeholder.png
└── ...
```

Cada archivo tiene una responsabilidad específica.

---

# Arquitectura de fuentes de verdad

La aplicación debe respetar estrictamente esta separación:

```text
info.json
    ↓
Contenido general del sitio

products.json
    ↓
Productos del showroom

design.json
    ↓
Sistema visual

background_hero.png
mujer_hero.png
sestre_logo.png
placeholder.png
    ↓
Assets visuales oficiales

este prompt
    ↓
Reglas funcionales y excepciones
```

No mezclar responsabilidades.

---

# `info.json` — contenido general

Toda la información institucional, comercial y estructural del sitio debe obtenerse desde:

```text
./info.json
```

Puede contener:

- identidad de Sestre;
- posicionamiento;
- textos;
- títulos;
- subtítulos;
- CTAs;
- navegación;
- WhatsApp;
- Instagram;
- Facebook;
- ubicación;
- contenido desktop;
- contenido mobile;
- comportamiento responsive;
- SEO;
- configuración de secciones.

## Regla obligatoria

**No modificar `info.json`.**

No:

- reescribir sus textos;
- reemplazar contenidos;
- inventar información faltante;
- hardcodear información disponible en el archivo;
- crear otra fuente con los mismos datos.

`info.json` define:

# QUÉ contenido general mostrar.

---

# Excepción importante — productos

Aunque `info.json` pueda contener actualmente ejemplos o información de productos dentro de estructuras como:

```text
catalog.products
```

esa información **NO debe utilizarse como fuente de productos durante la implementación**.

A partir de este proyecto:

# `products.json` es la única fuente de verdad de los productos.

Esto aplica a:

- catálogo;
- nuevos ingresos;
- cards;
- modales;
- precio;
- talles;
- imágenes;
- descripción;
- calce;
- categorías;
- estado de novedad;
- WhatsApp de producto.

Si existe conflicto entre un producto de `info.json` y `products.json`:

# siempre gana `products.json`.

No modificar `info.json` para corregir esta duplicación.

Simplemente ignorar los registros de productos existentes allí.

---

# `products.json` — fuente única de productos

Crear y utilizar:

```text
./products.json
```

como fuente única de productos.

El archivo debe poder actualizarse fácilmente sin modificar componentes.

El objetivo es que para:

- agregar una prenda;
- eliminar una prenda;
- cambiar un precio;
- modificar talles;
- cambiar una imagen;
- marcar una prenda como nueva;
- dejar de mostrarla como novedad;

solamente sea necesario actualizar:

```text
products.json
```

y, cuando corresponda, agregar la imagen del producto.

Después:

```text
git add .
git commit
git push
```

GitHub Actions realizará nuevamente el build y deploy.

No debe ser necesario modificar código para actualizar el catálogo.

---

# Estructura recomendada de `products.json`

Definir una estructura simple y mantenible.

Ejemplo conceptual:

```json
{
  "products": [
    {
      "id": "product-001",
      "name": "Nombre del producto",
      "price": "$00.000",
      "image": "products/product-001.webp",
      "images": ["products/product-001.webp"],
      "sizes": ["XL", "XXL"],
      "fit_information": "Información opcional",
      "description": "Descripción opcional",
      "category": "Categoría",
      "is_new": true
    }
  ]
}
```

Este ejemplo define estructura, no contenido real.

No utilizar estos valores como productos reales.

---

# Campos de producto

## `id`

Identificador único y estable.

Ejemplo conceptual:

```text
vestido-cruzado-negro
```

Debe utilizarse internamente para:

- keys;
- selección;
- modal;
- referencias.

---

## `name`

Nombre comercial de la prenda.

---

## `price`

Precio mostrado.

Debe provenir únicamente de `products.json`.

---

## `image`

Imagen principal.

Ejemplo:

```text
products/vestido-cruzado.webp
```

---

## `images`

Opcional.

Permite agregar varias imágenes para el modal:

```json
"images": [
  "products/vestido-frente.webp",
  "products/vestido-dorso.webp"
]
```

Si solamente existe `image`, utilizar esa imagen.

---

## `sizes`

Opcional.

Puede contener talles reales:

```json
"sizes": [
  "XL",
  "XXL",
  "3XL"
]
```

No inventar talles.

---

## `fit_information`

Opcional.

Información breve sobre calce o medidas.

---

## `description`

Opcional.

Descripción ampliada del producto.

---

## `category`

Opcional.

Utilizar para filtros solamente si existe en `products.json`.

---

# Estado de novedad — `is_new`

Cada producto debe poder indicar si es un ingreso reciente mediante:

```json
"is_new": true
```

o:

```json
"is_new": false
```

Este campo controla automáticamente su tratamiento visual.

---

# Productos nuevos

Cuando:

```json
"is_new": true
```

el producto:

- debe aparecer dentro de **Nuevos ingresos**;
- también puede aparecer normalmente dentro del catálogo;
- debe recibir visualmente el tratamiento de novedad definido en `design.json`;
- puede mostrar el badge de nuevo ingreso definido por `info.json`.

Conceptualmente:

```text
[NUEVO]
```

No crear una segunda lista independiente de productos nuevos.

La sección se genera mediante:

```ts
const newProducts = products.filter((product) => product.is_new === true);
```

---

# Producto no nuevo

Cuando:

```json
"is_new": false
```

el producto:

- aparece normalmente en el catálogo;
- no aparece dentro de Nuevos ingresos;
- no muestra badge de novedad.

Por lo tanto:

```text
products.json
      ↓
todos los productos
      ↓
filter(is_new)
      ↓
Nuevos ingresos
```

Debe existir un único registro de cada producto.

---

# Actualización del showroom

El flujo esperado para administrar productos será:

```text
Editar products.json
        ↓
Agregar/cambiar imágenes si corresponde
        ↓
git commit
        ↓
git push origin main
        ↓
GitHub Actions
        ↓
Astro build
        ↓
GitHub Pages actualizado
```

No desarrollar CMS ni administrador.

El JSON funciona como catálogo administrable mediante código.

---

# Ubicación de imágenes de productos

Para facilitar productos dinámicos desde JSON, utilizar preferentemente:

```text
public/
└── products/
```

Ejemplo:

```text
public/
└── products/
    ├── blazer-lino.webp
    ├── vestido-negro.webp
    ├── camisa-oversize.webp
    └── ...
```

Dentro de `products.json`, almacenar rutas relativas:

```json
"image": "products/blazer-lino.webp"
```

No utilizar:

```text
/products/blazer-lino.webp
```

con `/` inicial.

Esto es importante para GitHub Pages.

---

# Placeholder obligatorio de producto

Existe un asset:

```text
./placeholder.png
```

Debe utilizarse obligatoriamente cuando un producto no posea una imagen válida.

El placeholder debe cubrir al menos estos casos:

- `image` no existe;
- `image` es `null`;
- `image` está vacío;
- el producto no posee `images`;
- la ruta especificada devuelve error;
- el archivo no puede cargarse;
- la imagen produce 404.

Nunca mostrar:

- icono de imagen rota;
- espacio vacío;
- texto alternativo desbordado;
- fondo gris genérico del navegador.

---

# Comportamiento del placeholder

La lógica debe ser:

```text
¿Existe imagen válida?
        │
   ┌────┴────┐
   │         │
  Sí        No
   │         │
imagen    placeholder.png
```

El mismo comportamiento debe aplicarse en:

- Product Card;
- Nuevos ingresos;
- Catálogo;
- Modal;
- galería, cuando corresponda.

---

# Fallback también ante error de carga

No alcanza con comprobar si la propiedad existe.

Si la URL existe en JSON pero el archivo falla, debe reemplazarse automáticamente por:

```text
placeholder.png
```

Centralizar esta lógica en un componente reutilizable.

Ejemplo conceptual:

```text
ProductImage
```

No repetir la lógica en cada card.

---

# Assets visuales oficiales

Además de `products.json`, existen assets visuales específicos:

```text
./background_hero.png
./mujer_hero.png
./sestre_logo.png
./placeholder.png
```

No reemplazarlos por:

- imágenes de stock;
- assets generados;
- aproximaciones;
- placeholders externos;
- logos recreados.

---

# Logo oficial

Utilizar:

```text
./sestre_logo.png
```

como logo oficial.

Utilizarlo al menos en:

- Header;
- Footer.

No recrearlo mediante:

- texto;
- otra fuente;
- SVG generado;
- CSS.

Mantener:

- proporciones;
- relación de aspecto;
- legibilidad;
- espacio de seguridad.

---

# Sistema visual — `design.json`

Todo el diseño debe provenir de:

```text
./design.json
```

Es la fuente de verdad para:

- paleta;
- tipografías;
- tamaños;
- espaciados;
- containers;
- botones;
- cards;
- sombras;
- bordes;
- radios;
- fondos;
- layout;
- responsive;
- estados interactivos;
- estilo general.

No crear un sistema visual alternativo.

`design.json` define:

# CÓMO debe verse.

---

# Hero — assets aprobados

El Hero utilizará obligatoriamente:

```text
./background_hero.png
./mujer_hero.png
```

`background_hero.png` corresponde al recurso gráfico situado detrás de la modelo.

`mujer_hero.png` corresponde a la modelo principal.

La modelo debe mostrarse por encima del background.

Conceptualmente:

```text
Hero Visual
│
├── background_hero.png
│
└── mujer_hero.png
```

---

# Hero aprobado

La composición actual del Hero está:

# APROBADA.

No desarrollar una propuesta nueva para esta sección.

Mantener:

- texto a un lado;
- modelo como protagonista;
- background detrás de la modelo;
- buena jerarquía;
- espacio negativo;
- CTAs visibles;
- beneficios integrados;
- estética femenina moderna;
- equilibrio entre contenido y fotografía.

No convertirlo en:

- slider;
- carrusel;
- video;
- diseño fullscreen diferente;
- composición 3D;
- Hero experimental.

---

# Hero desktop

Mantener conceptualmente:

```text
┌───────────────────────────────────────────────┐
│                                               │
│   CONTENIDO                  VISUAL            │
│                                               │
│   Eyebrow              background_hero.png     │
│   H1                         +                 │
│   Descripción           mujer_hero.png         │
│                                               │
│   CTA                                         │
│   WhatsApp                                    │
│                                               │
│   Beneficios                                  │
│                                               │
└───────────────────────────────────────────────┘
```

Evitar:

- reducir excesivamente la modelo;
- deformarla;
- recortarla incorrectamente;
- ocultarla;
- separarla visualmente de su background.

---

# Hero mobile

Debe ser una adaptación del Hero aprobado.

No crear otro Hero.

Utilizar:

```text
background_hero.png
mujer_hero.png
```

y respetar las configuraciones mobile existentes en:

```text
info.json
design.json
```

No limitarse a escalar desktop.

Resolver específicamente la composición mobile.

---

# Prioridad de fuentes

Ante cualquier conflicto:

```text
1. Reglas explícitas de este prompt
2. products.json para cualquier dato de producto
3. info.json para contenido general
4. design.json para sistema visual
5. assets oficiales
6. decisiones técnicas
```

---

# Excepción obligatoria — Guía de talles

Aunque `info.json` contenga:

```text
size_guide
```

o referencias:

```text
Guía de talles
```

NO crear una sección independiente de Guía de talles.

No modificar `info.json`.

Ignorar esas referencias cuando impliquen renderizar dicha sección.

Por lo tanto:

- no crear `SizeGuide.astro`;
- no crear sección `size_guide`;
- no crear anchor;
- no mostrarla en Header;
- no mostrarla en Footer;
- ignorarla en `section_order`;
- ignorarla en `responsive_differences`.

Esto NO elimina los talles de los productos.

Los talles existentes en:

```text
products.json
```

deben seguir mostrándose.

---

# Arquitectura general

Construir:

# Single Page Landing

Toda la experiencia principal debe existir dentro de:

```text
/
```

No crear:

```text
/productos/*
/producto/*
/catalogo
/contacto
/nuevos-ingresos
```

Navegación mediante anchors.

---

# Estructura del sitio

La estructura general debe derivarse de:

```text
info.json
```

Puede incluir, según sus datos:

```text
Header
Hero
Benefits
New Arrivals
Catalog
Brand Message
How To Buy
WhatsApp CTA
Contact Strip
Footer
Mobile Bottom Navigation
```

Antes de implementar una sección:

```text
1. Leer info.json
2. Revisar desktop
3. Revisar mobile
4. Leer design.json
5. Implementar
```

No inventar nuevas secciones.

---

# Header

Consumir contenido desde `info.json`.

Usar:

```text
sestre_logo.png
```

## Desktop

Implementar:

- logo;
- navegación;
- CTA WhatsApp.

Solo enlazar secciones existentes.

Eliminar visualmente cualquier referencia a:

```text
Guía de talles
```

---

# Header mobile

Implementar según `info.json`.

Puede incluir:

- menú hamburguesa;
- logo;
- WhatsApp.

Debe:

- abrir correctamente;
- cerrarse correctamente;
- cerrarse al seleccionar una opción;
- ser accesible;
- evitar overflow horizontal.

---

# Benefits

Mostrar únicamente los beneficios definidos en `info.json`.

No inventar argumentos comerciales.

Mantener:

- buena jerarquía;
- poco texto;
- lectura rápida;
- iconografía controlada.

---

# Nuevos ingresos

La configuración visual de la sección proviene de:

```text
info.json
design.json
```

Pero los productos provienen exclusivamente de:

```text
products.json
```

Seleccionar:

```ts
products.filter((product) => product.is_new === true);
```

---

## Nuevos ingresos desktop

Implementar preferentemente:

- varias cards visibles;
- navegación anterior/siguiente;
- desplazamiento suave.

---

## Nuevos ingresos mobile

Priorizar:

- swipe;
- scroll horizontal;
- scroll snapping.

Evitar librerías pesadas cuando CSS sea suficiente.

---

# Catálogo

La sección y sus títulos provienen de:

```text
info.json
```

Los productos provienen de:

```text
products.json
```

No utilizar:

```text
info.desktop.catalog.products
```

como fuente real del catálogo.

---

# Product Card

Cada card puede mostrar únicamente datos existentes:

- imagen;
- nombre;
- precio;
- talles;
- información breve;
- CTA;
- badge de novedad.

No inventar:

- stock;
- material;
- color;
- precio;
- talles;
- descuento;
- cuotas;
- promociones.

---

# Badge de nuevo producto

Si:

```json
"is_new": true
```

mostrar el tratamiento visual correspondiente.

Si `info.json` contiene un texto para el badge de nuevos ingresos, utilizar ese texto.

Si:

```json
"is_new": false
```

no mostrar badge.

---

# Apertura de producto

Al interactuar con:

- imagen;
- nombre;
- card;
- acción de detalle;

abrir un modal.

No cambiar de URL.

No crear página independiente.

---

# Modal de producto

Debe recibir el mismo objeto proveniente de:

```text
products.json
```

No duplicar información.

Puede mostrar:

- imagen;
- galería;
- nombre;
- precio;
- talles;
- calce;
- descripción;
- CTA WhatsApp.

Si una propiedad no existe:

# no renderizar el bloque.

---

# Imagen dentro del modal

Aplicar exactamente la misma lógica de fallback.

Si la imagen no existe o falla:

```text
placeholder.png
```

No mostrar imagen rota.

---

# UX del modal

Debe:

- cerrarse con `X`;
- cerrarse con backdrop;
- cerrarse con `Escape`;
- bloquear scroll del body;
- gestionar foco;
- devolver foco al elemento que lo abrió;
- funcionar con teclado;
- ser responsive;
- ser accesible.

Utilizar:

```html
role="dialog" aria-modal="true"
```

cuando corresponda.

En mobile puede funcionar como:

```text
bottom sheet
```

o modal casi fullscreen.

---

# Selección de talle

Si el producto contiene:

```json
"sizes": [
  "XL",
  "XXL",
  "3XL"
]
```

permitir seleccionar un talle.

El talle seleccionado debe quedar disponible para el CTA de WhatsApp.

Si no existen talles concretos:

- no inventarlos;
- mostrar la información existente si la hubiera;
- permitir consultar directamente.

---

# WhatsApp por producto

Cada producto deberá poder consultarse por WhatsApp.

Debe existir CTA en:

- Product Card;
- Product Modal.

El mensaje debe generarse usando el producto real de `products.json`.

Ejemplo conceptual:

```text
Hola, Sestre. Quería consultar por:

Vestido Cruzado
Precio: $45.900

¿Está disponible?
```

Con talle:

```text
Hola, Sestre. Quería consultar por:

Vestido Cruzado
Precio: $45.900
Talle: XXL

¿Está disponible?
```

Codificar mediante:

```ts
encodeURIComponent(message);
```

y construir:

```text
https://wa.me/NUMERO?text=MENSAJE
```

El teléfono debe obtenerse desde:

```text
info.json
```

No hardcodearlo.

---

# WhatsApp helper

Centralizar la funcionalidad.

Ejemplo conceptual:

```ts
function createWhatsAppUrl(product: Product, selectedSize?: string) {
  const message = createWhatsAppMessage(product, selectedSize);

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
```

No repetir lógica en varios componentes.

---

# Contacto

Datos desde:

```text
info.json
```

Puede incluir:

- WhatsApp;
- Instagram;
- Facebook;
- ubicación.

Enlaces externos:

```html
target="_blank" rel="noopener noreferrer"
```

cuando corresponda.

---

# Sticky Bottom Navigation

Si está definida para mobile en `info.json`, implementarla.

Puede contener:

```text
WhatsApp
Instagram
```

Debe:

- mantenerse fija;
- no cubrir productos;
- no cubrir botones;
- respetar safe-area;
- reservar espacio inferior.

Considerar:

```css
env(safe-area-inset-bottom)
```

---

# Responsive

Diseñar específicamente para:

```text
Desktop
Tablet
Mobile
```

No reducir simplemente desktop.

Utilizar:

```text
info.json
design.json
```

para diferencias responsive.

Prestar especial atención a:

- Header;
- Hero;
- benefits;
- nuevos ingresos;
- catálogo;
- cards;
- modal;
- CTAs;
- navegación inferior.

---

# Mobile-first

Priorizar la experiencia móvil.

El principal flujo será:

```text
Producto
   ↓
Modal
   ↓
WhatsApp
```

Mantener targets táctiles de aproximadamente:

```text
44 × 44 px
```

como mínimo recomendado.

---

# Animaciones e interacciones

Utilizar:

- **Framer Motion** para animaciones complejas que realmente requieran React.
- **Aceternity UI** únicamente para elementos puntuales que aporten valor.
- **CSS / Tailwind CSS** para hover, transitions y animaciones simples.

No utilizar Framer Motion ni Aceternity UI indiscriminadamente.

Priorizar:

- rendimiento;
- producto;
- mobile;
- simplicidad.

Aceternity UI no debe modificar:

- Hero aprobado;
- `background_hero.png`;
- `mujer_hero.png`;
- `sestre_logo.png`.

---

# Animaciones permitidas

Preferir:

- fade;
- translate ligero;
- scale muy suave;
- hover de cards;
- hover de imágenes;
- transiciones;
- reveal discreto con scroll.

Evitar:

- 3D excesivo;
- parallax agresivo;
- movimiento constante;
- elementos decorativos intrusivos.

---

# Accesibilidad

Implementar:

- HTML semántico;
- H1 único;
- jerarquía H2/H3;
- alt descriptivo;
- focus-visible;
- navegación por teclado;
- modal accesible;
- contraste adecuado;
- labels;
- botones reales.

Considerar:

```css
@media (prefers-reduced-motion: reduce) {
  /* reducir animaciones */
}
```

---

# Performance

Priorizar:

- Astro estático;
- HTML generado en build;
- poco JavaScript;
- lazy loading;
- imágenes optimizadas;
- dimensiones explícitas;
- mínimo CLS;
- CSS eficiente.

Hero:

```text
carga prioritaria
```

Productos fuera del viewport:

```html
loading="lazy"
```

---

# Stack tecnológico

## Framework

```text
Astro + TypeScript
```

## Interactividad

React únicamente donde aporte valor:

```text
ProductModal
Carousel
MobileMenu
SizeSelector
```

No convertir la página en SPA.

---

## Estilos

```text
Tailwind CSS
```

Sistema visual:

```text
design.json
```

---

## Animaciones

```text
Framer Motion
CSS / Tailwind
Aceternity UI de forma puntual
```

---

## Iconos

Preferentemente:

```text
Lucide React
```

No mezclar librerías.

---

# Arquitectura sugerida

```text
/
├── info.json
├── products.json
├── design.json
├── background_hero.png
├── mujer_hero.png
├── sestre_logo.png
├── placeholder.png
│
├── public/
│   └── products/
│
└── src/
    ├── components/
    │   ├── Header.astro
    │   ├── Hero.astro
    │   ├── Benefits.astro
    │   ├── NewArrivals.astro
    │   ├── Catalog.astro
    │   ├── ProductCard.astro
    │   ├── ProductImage.astro
    │   ├── ProductModal.tsx
    │   ├── BrandMessage.astro
    │   ├── HowToBuy.astro
    │   ├── WhatsAppCTA.astro
    │   ├── ContactStrip.astro
    │   ├── MobileBottomNav.astro
    │   └── Footer.astro
    │
    ├── utils/
    │   ├── whatsapp.ts
    │   ├── products.ts
    │   └── assets.ts
    │
    ├── layouts/
    │   └── Layout.astro
    │
    └── pages/
        └── index.astro
```

No crear:

```text
SizeGuide.astro
```

---

# Utilidad de productos

Centralizar lectura y filtros.

Conceptualmente:

```ts
import data from "../../products.json";

export const products = data.products;

export const newProducts = products.filter(
  (product) => product.is_new === true,
);
```

No definir arrays manuales dentro de:

```text
Catalog
NewArrivals
ProductCard
```

---

# TypeScript

Crear interfaces basadas en la estructura real de `products.json`.

Ejemplo:

```ts
interface Product {
  id: string;
  name: string;
  price?: string;
  image?: string;
  images?: string[];
  sizes?: string[];
  fit_information?: string;
  description?: string;
  category?: string;
  is_new?: boolean;
}
```

Las propiedades opcionales no deben generar elementos vacíos.

---

# SEO

La configuración SEO debe provenir de:

```text
info.json
```

Configurar:

```text
<title>
meta description
H1
H2/H3
Open Graph
canonical
```

No inventar información para Schema.org.

---

# Rutas y GitHub Pages

El proyecto debe funcionar correctamente en:

```text
localhost
```

y:

```text
https://diegolu7.github.io/sestre/
```

Repositorio:

```text
git@github.com:diegolu7/sestre.git
```

GitHub Pages ya está configurado para:

```text
Build and deployment → GitHub Actions
```

---

# Configuración Astro para GitHub Pages

Configurar:

```js
site: 'https://diegolu7.github.io',
base: '/sestre',
```

Ejemplo conceptual:

```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://diegolu7.github.io",
  base: "/sestre",
  integrations: [react()],
});
```

Conservar cualquier configuración adicional requerida por Tailwind u otras integraciones.

---

# Rutas de imágenes compatibles con GitHub Pages

No utilizar rutas hardcodeadas como:

```text
/products/imagen.webp
```

porque `/` apunta al root del dominio y puede romperse en:

```text
/sestre/
```

Para assets públicos crear un helper.

Conceptualmente:

```ts
export function withBase(path: string) {
  const cleanPath = path.replace(/^\/+/, "");

  return `${import.meta.env.BASE_URL}${cleanPath}`;
}
```

Ejemplo:

```text
products.json
```

contiene:

```json
"image": "products/vestido.webp"
```

y la aplicación resuelve:

```text
/sestre/products/vestido.webp
```

en GitHub Pages.

En local deberá resolver correctamente también.

---

# Assets importados

Para:

```text
background_hero.png
mujer_hero.png
sestre_logo.png
placeholder.png
```

preferir imports administrados por Astro/Vite cuando resulte conveniente.

Esto evita romper sus rutas durante el build.

---

# Placeholder y GitHub Pages

El fallback de:

```text
placeholder.png
```

debe utilizar una URL generada correctamente por Astro.

No hardcodear:

```text
/placeholder.png
```

si eso provoca fallas bajo:

```text
/sestre/
```

El placeholder debe funcionar:

- en `npm run dev`;
- en `npm run preview`;
- en GitHub Pages.

---

# Navegación interna

Para anchors utilizar:

```html
<a href="#catalogo">Catálogo</a>
```

No utilizar:

```html
<a href="/#catalogo"></a>
```

---

# GitHub Actions

Crear:

```text
.github/workflows/deploy.yml
```

utilizando el flujo oficial de Astro para GitHub Pages.

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

      - name: Install, build and upload
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
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v5
```

---

# Scripts requeridos

`package.json` debe permitir:

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

# Lockfile

Si se utiliza npm:

```text
package-lock.json
```

debe estar versionado.

No ignorarlo.

---

# Verificación local obligatoria

Antes de finalizar ejecutar:

```bash
npm install
npm run dev
```

Comprobar:

- Header;
- Hero;
- logo;
- background Hero;
- mujer Hero;
- catálogo;
- nuevos ingresos;
- productos;
- badge `is_new`;
- placeholder;
- modal;
- selector de talle;
- WhatsApp;
- responsive.

---

# Verificación de producción

Ejecutar:

```bash
npm run build
```

Debe generar:

```text
/dist
```

Luego:

```bash
npm run preview
```

Verificar nuevamente:

- Hero;
- imágenes;
- productos;
- placeholder;
- modal;
- rutas;
- navegación;
- WhatsApp.

No considerar finalizada la implementación solamente porque:

```text
npm run dev
```

funciona.

---

# Verificación de placeholder

Crear o utilizar temporalmente un producto sin imagen durante las pruebas para verificar que:

```text
producto sin image
       ↓
placeholder.png
```

También comprobar un path inválido para verificar:

```text
imagen 404
    ↓
placeholder.png
```

No dejar datos ficticios de prueba en la versión final.

---

# Verificación de novedades

Comprobar al menos conceptualmente ambos estados.

```json
"is_new": true
```

debe:

- aparecer en Nuevos ingresos;
- mostrar tratamiento visual de novedad.

```json
"is_new": false
```

debe:

- no aparecer en Nuevos ingresos;
- continuar apareciendo normalmente en catálogo.

---

# Verificación de actualización por JSON

La arquitectura debe garantizar que agregar un producto mediante:

```text
products.json
```

no requiera modificar:

```text
Catalog.astro
NewArrivals.astro
ProductCard.astro
ProductModal.tsx
```

Este es un criterio obligatorio de aceptación.

---

# Reglas obligatorias

1. No modificar `info.json`.
2. No modificar `design.json`.
3. Utilizar `info.json` para contenido general.
4. Utilizar `products.json` como única fuente real de productos.
5. Ignorar productos incluidos dentro de `info.json`.
6. No duplicar productos en código.
7. Actualizar catálogo mediante `products.json`.
8. Utilizar `is_new` para controlar nuevos ingresos.
9. Un producto `is_new: true` debe aparecer automáticamente en Nuevos ingresos.
10. Un producto `is_new: false` no debe aparecer en Nuevos ingresos.
11. Ambos pueden aparecer en catálogo.
12. Utilizar `placeholder.png` cuando falte una imagen.
13. Utilizar `placeholder.png` también cuando falle la carga.
14. No mostrar imágenes rotas.
15. Utilizar `sestre_logo.png`.
16. Utilizar `background_hero.png`.
17. Utilizar `mujer_hero.png`.
18. Mantener el Hero aprobado.
19. No crear una nueva propuesta de Hero.
20. No crear Guía de talles.
21. No mostrar Guía de talles en navegación.
22. Mantener talles dentro de productos cuando existan.
23. Mantener todo en una landing.
24. No crear páginas individuales de producto.
25. Abrir producto mediante modal.
26. Permitir consulta por WhatsApp.
27. Mensaje WhatsApp con información real del producto.
28. Incluir talle seleccionado cuando exista.
29. No inventar talles.
30. No inventar precios.
31. No inventar productos.
32. No inventar stock.
33. No hardcodear teléfono.
34. No crear carrito.
35. No crear checkout.
36. No crear login.
37. No construir una SPA.
38. Utilizar Astro + TypeScript.
39. React solamente para interactividad necesaria.
40. Utilizar Tailwind CSS.
41. Utilizar Framer Motion de forma controlada.
42. Utilizar Aceternity UI solo cuando aporte valor.
43. Respetar `design.json`.
44. Mantener accesibilidad.
45. Mantener buen rendimiento.
46. Funcionar en local.
47. Funcionar bajo `/sestre/`.
48. No romper imágenes en GitHub Pages.
49. `npm run build` debe finalizar correctamente.
50. Las actualizaciones de `products.json` deben desplegarse mediante GitHub Actions sin cambios de código.

---

# Flujo final de administración

La solución terminada debe permitir:

```text
Agregar producto a products.json
          ↓
Agregar imagen a public/products/
          ↓
Definir is_new true/false
          ↓
Commit
          ↓
Push main
          ↓
GitHub Actions
          ↓
Deploy
```

Si no existe imagen:

```text
Agregar producto
      ↓
Sin image válida
      ↓
placeholder.png
```

---

# Resultado esperado

La experiencia final será:

```text
Usuaria entra
      ↓
Hero Sestre
      ↓
Descubre la propuesta plus size
      ↓
Explora Nuevos ingresos
      ↓
Productos con is_new = true
      ↓
Explora catálogo completo
      ↓
Abre una prenda
      ↓
Modal
      ↓
Ve imagen real o placeholder
      ↓
Consulta precio / talle / información
      ↓
WhatsApp
      ↓
Coordina compra
```

Todo debe suceder dentro de la misma landing excepto los enlaces externos.

La web debe sentirse como un:

# Showroom digital de indumentaria femenina plus size

moderno, elegante, femenino, simple y orientado a conversión.

La prioridad final es:

# Producto → Modal → WhatsApp → Conversión

---

# Última tarea

Una vez terminada y validada toda la implementación:

1. comprobar `npm run dev`;
2. comprobar `npm run build`;
3. comprobar `npm run preview`;
4. comprobar rutas con `base: '/sestre'`;
5. comprobar imágenes;
6. comprobar `placeholder.png`;
7. comprobar `products.json`;
8. comprobar `is_new`;
9. comprobar modal;
10. comprobar WhatsApp;
11. comprobar responsive;
12. comprobar que no exista Guía de talles;
13. comprobar GitHub Pages.

Por último, si existe en el directorio raíz:

```text
./deploy.md
```

leerlo y ejecutar sus instrucciones de deployment como **última fase de la tarea**.

Las instrucciones de `deploy.md` deben considerarse específicas del deploy y no deben modificar las responsabilidades establecidas aquí para:

```text
info.json
products.json
design.json
```

La implementación no se considera finalizada hasta que funcione correctamente tanto:

```text
Local:
npm run dev
npm run preview
```

como:

```text
Producción:
https://diegolu7.github.io/sestre/
```
