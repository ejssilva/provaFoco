import { useEffect } from "react";
import ReactGA from "react-ga4";
import { useLocation } from "wouter";

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const [location] = useLocation();

  useEffect(() => {
    // Initialize GA4 if ID is provided
    const gaId = measurementId || import.meta.env.VITE_GA_MEASUREMENT_ID;
    
    if (gaId) {
      if (!window.ga4Initialized) {
        ReactGA.initialize(gaId);
        window.ga4Initialized = true;
        console.log("[GA4] Initialized with ID:", gaId);
      }
    }
  }, [measurementId]);

  useEffect(() => {
    // Send pageview on route change
    if (window.ga4Initialized) {
      ReactGA.send({ hitType: "pageview", page: location });
      console.log("[GA4] Pageview sent:", location);
    }
  }, [location]);

  return null;
}

// Add type definition to window to avoid TS errors
declare global {
  interface Window {
    ga4Initialized?: boolean;
  }
}
