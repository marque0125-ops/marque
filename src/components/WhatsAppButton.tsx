import React from 'react';

export default function WhatsAppButton() {
  const phoneNumber = "918754498038";
  const message = encodeURIComponent("Hello! I'm interested in your RC cars.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
      aria-label="Chat on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8"
      >
        <path d="M12.031 0C5.385 0 0 5.384 0 12.029c0 2.128.552 4.195 1.6 6.02L.159 23.364l5.485-1.44a11.96 11.96 0 006.387 1.838h.005c6.645 0 12.031-5.385 12.031-12.03C24.067 5.385 18.681 0 12.031 0zm.005 21.737h-.003a9.927 9.927 0 01-5.068-1.385l-.363-.216-3.768.989.996-3.676-.236-.375a9.92 9.92 0 01-1.522-5.31c0-5.485 4.464-9.948 9.957-9.948 2.658 0 5.158 1.036 7.037 2.915a9.914 9.914 0 012.91 7.036c0 5.485-4.464 9.949-9.958 9.949zm5.46-7.466c-.299-.15-1.77-.874-2.046-.974-.275-.1-.476-.15-.676.15-.201.3-.776.974-.951 1.173-.176.2-.351.225-.651.075-.3-.15-1.263-.465-2.404-1.485-.887-.793-1.486-1.77-1.66-2.07-.176-.3-.02-.463.13-.612.135-.135.3-.3.45-.45.151-.15.201-.25.301-.425.101-.175.051-.325-.025-.475-.075-.15-.676-1.626-.926-2.226-.243-.585-.49-.505-.676-.514-.175-.008-.376-.008-.576-.008a1.107 1.107 0 00-.8.375c-.276.3-1.052 1.025-1.052 2.501 0 1.476 1.077 2.9 1.227 3.1.15.2 2.115 3.226 5.127 4.526 1.956.845 2.51.8 3.208.685.834-.14 1.77-.724 2.02-1.424.25-.7.25-1.3.175-1.425-.075-.125-.276-.2-.576-.35z" />
      </svg>
    </a>
  );
}
