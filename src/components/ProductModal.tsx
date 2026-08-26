import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Product } from "../types/product";
import { createWhatsAppUrl } from "../utils/whatsapp";
import { isBlankImage, withBase } from "../utils/assets";
import placeholder from "../assets/placeholder.png";
import WhatsAppIcon from "./icons/WhatsAppIcon";

const FALLBACK = placeholder.src;

function ProductImage({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(
    isBlankImage(src) ? FALLBACK : withBase(src as string),
  );

  useEffect(() => {
    setCurrentSrc(isBlankImage(src) ? FALLBACK : withBase(src as string));
  }, [src]);

  const handleError = () => {
    if (currentSrc !== FALLBACK) {
      setCurrentSrc(FALLBACK);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      decoding="async"
      className="h-full w-full object-cover"
    />
  );
}

export default function ProductModal() {
  const [product, setProduct] = useState<Product | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const open = useCallback((target: Product) => {
    lastFocusedRef.current = document.activeElement as HTMLElement;
    setProduct(target);
    setActiveIndex(0);
    setSelectedSize(null);
    document.body.style.overflow = "hidden";
  }, []);

  useEffect(() => {
    if (product) {
      closeButtonRef.current?.focus();
    }
  }, [product]);

  const close = useCallback(() => {
    setProduct(null);
    document.body.style.overflow = "";
    lastFocusedRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      open((event as CustomEvent<Product>).detail);
    };

    window.addEventListener("sestre:open-product", handler);

    return () => window.removeEventListener("sestre:open-product", handler);
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }

      if (event.key !== "Tab" || !product) return;

      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [product, close]);

  const images = product
    ? product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : []
    : [];

  const whatsappUrl = product
    ? createWhatsAppUrl(product, selectedSize ?? undefined)
    : "#";

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={close}
          className="fixed inset-0 z-50 flex items-end justify-center bg-morado-900/50 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            initial={{ y: 48, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 48, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-card bg-white shadow-xl sm:rounded-card"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-pill bg-white/90 text-morado-900 transition-colors duration-180 ease-out hover:text-morado-500"
            >
              <X size={22} />
            </button>

            {images.length > 0 ? (
              <div className="relative">
                <div className="aspect-[4/3] w-full">
                  <ProductImage src={images[activeIndex]} alt={product.name} />
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 p-3">
                    {images.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Ver imagen ${index + 1}`}
                        aria-pressed={index === activeIndex}
                        className={`h-14 w-14 overflow-hidden rounded-badge border-2 transition-colors duration-180 ease-out ${
                          index === activeIndex
                            ? "border-morado-500"
                            : "border-transparent"
                        }`}
                      >
                        <ProductImage src={image} alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-[4/3] w-full">
                <ProductImage src={undefined} alt={product.name} />
              </div>
            )}

            <div className="p-5 sm:p-6">
              {product.is_new && (
                <span className="inline-block rounded-badge bg-morado-100 px-2.5 py-1 text-[11px] font-semibold text-morado-900">
                  Nuevo
                </span>
              )}

              <h2
                id="product-modal-title"
                className="mt-2 text-xl font-bold text-ink"
              >
                {product.name}
              </h2>

              {product.price && (
                <p className="mt-1 text-lg font-bold text-ink">{product.price}</p>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-5">
                  <p className="text-[12.5px] font-medium tracking-wide text-muted">
                    Talle
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() =>
                          setSelectedSize((current) =>
                            current === size ? null : size,
                          )
                        }
                        aria-pressed={selectedSize === size}
                        className="min-w-11 rounded-btn border-[1.5px] border-morado-300 bg-morado-50 px-4 py-2 text-sm font-semibold text-morado-900 transition-colors duration-180 ease-out hover:border-morado-500 data-[pressed=true]:border-morado-500 data-[pressed=true]:bg-morado-500 data-[pressed=true]:text-white"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.fit_information && (
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {product.fit_information}
                </p>
              )}

              {product.description && (
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {product.description}
                </p>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-btn bg-morado-500 px-6 py-3 text-[15px] font-semibold text-white transition-colors duration-180 ease-out hover:bg-morado-600"
              >
                <WhatsAppIcon size={18} />
                Consultar por WhatsApp
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
