import type { Product } from "../types/product";
import info from "../../info.json";

const site = info.site;

export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

export function siteWhatsAppNumber(): string {
  return sanitizePhone(site.whatsapp);
}

export function formatPhoneNumber(): string {
  const digits = siteWhatsAppNumber();
  const country = digits.slice(0, 2);
  const mobile = digits[2] ?? "";
  const area = digits.slice(3, 7);
  const subscriber = digits.slice(7);
  const split = `${subscriber.slice(0, 2)}-${subscriber.slice(2)}`;
  return `+${country} ${mobile} ${area} ${split}`;
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
