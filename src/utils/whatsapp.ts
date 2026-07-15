const DEFAULT_PHONE = "5521973101451";

export function buildWaLink(message: string, phone = DEFAULT_PHONE): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export const WHATSAPP_PHONE = DEFAULT_PHONE;
