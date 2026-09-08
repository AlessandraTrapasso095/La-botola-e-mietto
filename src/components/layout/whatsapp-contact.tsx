import { businessInfo } from "@/config/business";

function getWhatsAppHref() {
  const phone = businessInfo.phone.replace(/\D/g, "");
  const message = encodeURIComponent(businessInfo.whatsappMessage);

  return `https://wa.me/${phone}?text=${message}`;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <path
        d="M20.52 3.48A11.8 11.8 0 0 0 12.05 0C5.45 0 .08 5.37.08 11.97c0 2.1.55 4.16 1.59 5.97L0 24l6.2-1.63a11.93 11.93 0 0 0 5.84 1.49h.01C18.64 23.86 24 18.49 24 11.9c0-3.18-1.24-6.17-3.48-8.42Z"
        fill="currentColor"
      />
      <path
        d="M12.05 21.85h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.68.97.98-3.59-.23-.37a9.87 9.87 0 0 1-1.52-5.3c0-5.44 4.43-9.87 9.88-9.87a9.8 9.8 0 0 1 6.99 2.9 9.8 9.8 0 0 1 2.89 7c-.01 5.44-4.44 9.86-9.9 9.86Z"
        fill="var(--color-background)"
      />
      <path
        d="M17.47 14.46c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48a9 9 0 0 1-1.66-2.06c-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.21 5.09 4.5.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WhatsAppContact() {
  return (
    <a
      href={getWhatsAppHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Scrivici su WhatsApp"
      className="group border-border-subtle bg-surface-elevated text-text-strong hover:border-accent hover:text-accent-soft fixed right-4 bottom-4 z-[calc(var(--z-header)+1)] flex size-14 items-center justify-center rounded-full border shadow-[var(--shadow-ambient)] transition-[border-color,color,transform,background-color] duration-[var(--motion-fast)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] sm:right-6 sm:bottom-6 sm:h-14 sm:w-auto sm:gap-3 sm:rounded-full sm:px-5"
    >
      <WhatsAppIcon className="size-6 text-[#cfa45e]" />
      <span className="hidden text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase sm:inline">
        Scrivici
      </span>
      <span className="sr-only">su WhatsApp</span>
    </a>
  );
}
