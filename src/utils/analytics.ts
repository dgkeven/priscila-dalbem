// Analytics and tracking utilities
interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const trackEvent = ({ action, category, label, value }: AnalyticsEvent) => {
  // Google Analytics 4 tracking
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
  
  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', { action, category, label, value });
  }
};

// Track page views
export const trackPageView = (page: string) => {
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: page
    });
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Page View:', page);
  }
};

// Track user interactions
export const trackUserAction = (action: string, details?: unknown) => {
  trackEvent({
    action,
    category: "User Interaction",
    label: JSON.stringify(details),
  });
};
