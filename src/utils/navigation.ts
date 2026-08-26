import info from "../../info.json";

const ANCHOR_MAP: Record<string, string> = {
  Inicio: "#inicio",
  Catálogo: "#catalogo",
  "Nuevos ingresos": "#nuevos-ingresos",
  "Cómo comprar": "#como-comprar",
  Contacto: "#contacto",
};

const EXCLUDED_LINKS = new Set(["Guía de talles"]);

export interface NavLink {
  label: string;
  href: string;
}

export function buildNavLinks(items: string[]): NavLink[] {
  const links: NavLink[] = [];

  for (const item of items) {
    if (EXCLUDED_LINKS.has(item)) continue;

    const href = ANCHOR_MAP[item];

    if (href) {
      links.push({ label: item, href });
    }
  }

  return links;
}

export const desktopNavLinks: NavLink[] = buildNavLinks(
  info.desktop.header.navigation,
);

export const footerNavLinks: NavLink[] = buildNavLinks(
  info.desktop.footer.navigation.links,
);
