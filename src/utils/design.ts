export type DesignVars = Record<string, string>;

export function buildDesignVars(design: any): DesignVars {
  const vars: DesignVars = {};

  const morado = design?.colores?.escala_morado ?? {};
  for (const [key, value] of Object.entries<any>(morado)) {
    if (value?.hex) {
      const shade = key.replace("morado-", "");
      vars[`--sestre-morado-${shade}`] = value.hex;
    }
  }

  const neutros = design?.colores?.neutros ?? {};
  if (neutros["negro-display"]?.hex) vars["--sestre-ink"] = neutros["negro-display"].hex;
  if (neutros["gris-secundario"]?.hex) vars["--sestre-gray"] = neutros["gris-secundario"].hex;
  if (neutros.blanco?.hex) vars["--sestre-white"] = neutros.blanco.hex;

  const fondos = design?.colores?.fondos_seccion ?? {};
  if (fondos.pagina) vars["--sestre-bg-page"] = fondos.pagina;
  if (fondos.header) vars["--sestre-bg-header"] = fondos.header;
  if (fondos.tarjeta_producto) vars["--sestre-bg-card"] = fondos.tarjeta_producto;
  if (fondos.franja_info) vars["--sestre-bg-strip"] = fondos.franja_info;
  if (fondos.footer) vars["--sestre-bg-footer"] = fondos.footer;

  const familias = design?.tipografia?.familias ?? {};
  if (familias.serif_display?.font) vars["--sestre-font-serif"] = familias.serif_display.font;
  if (familias.sans_ui?.font) vars["--sestre-font-sans"] = familias.sans_ui.font;

  const radii = design?.efectos?.borderRadius ?? {};
  const radiusMap: Record<string, string> = {
    boton_grande: "--sestre-radius-btn",
    boton_chico_o_pill: "--sestre-radius-pill",
    tarjeta_imagen: "--sestre-radius-img",
    badge: "--sestre-radius-badge",
    circulo_icono: "--sestre-radius-circle",
    contenedor_card: "--sestre-radius-card",
  };
  for (const [key, varName] of Object.entries(radiusMap)) {
    if (radii[key]) vars[varName] = radii[key];
  }

  return vars;
}
