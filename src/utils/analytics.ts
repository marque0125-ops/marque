declare global {
  interface Window {
    fbq?: any;
    gtag?: any;
    dataLayer?: any[];
  }
}

/**
 * Global Analytics Utility for Tracking E-commerce Ad Performance
 * Supports Meta/Facebook Pixel and Google Analytics (gtag)
 */

export const trackPageView = () => {
  if (typeof window !== "undefined") {
    // Meta Pixel
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'page_view');
    }
  }
};

export const trackAddToCart = (productName: string, productId: string, value: number, currency: string = 'INR') => {
  if (typeof window !== "undefined") {
    // Meta Pixel
    if (window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_name: productName,
        content_ids: [productId],
        content_type: 'product',
        value: value,
        currency: currency,
      });
    }
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: currency,
        value: value,
        items: [
          {
            item_id: productId,
            item_name: productName,
            price: value,
            quantity: 1
          }
        ]
      });
    }
  }
};

export const trackInitiateCheckout = (value: number, numItems: number, currency: string = 'INR') => {
  if (typeof window !== "undefined") {
    // Meta Pixel
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        value: value,
        currency: currency,
        num_items: numItems
      });
    }
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: currency,
        value: value
      });
    }
  }
};

export const trackPurchase = (orderId: string, value: number, currency: string = 'INR') => {
  if (typeof window !== "undefined") {
    // Meta Pixel
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        content_type: 'product',
        value: value,
        currency: currency,
        order_id: orderId
      });
    }
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: orderId,
        currency: currency,
        value: value
      });
    }
  }
};
