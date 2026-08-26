import type { Product } from "../types/product";
import info from "../../info.json";

const site = info.site;

export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

export function siteWhatsAppNumber(): string {
  return sanitizePhone(site.whatsapp);
}

export function createWhatsAppMessage(
  product: Product,
  selectedSize?: string,
): string {
  const lines: string[] = ["Hola, Sestre. Quería consultar por:"];
  lines.push("");
  lines.push(product.name);

  if (product.price) {
    lines.push(`Precio: ${product.price}`);
  }

  if (selectedSize) {
    lines.push(`Talle: ${selectedSize}`);
  }

  lines.push("");
  lines.push("¿Está disponible?");

  return lines.join("\n");
}

export function createWhatsAppUrl(
  product: Product,
  selectedSize?: string,
): string {
  const message = createWhatsAppMessage(product, selectedSize);
  return `https://wa.me/${siteWhatsAppNumber()}?text=${encodeURIComponent(message)}`;
}

export function createGenericWhatsAppUrl(text: string): string {
  return `https://wa.me/${siteWhatsAppNumber()}?text=${encodeURIComponent(text)}`;
}
