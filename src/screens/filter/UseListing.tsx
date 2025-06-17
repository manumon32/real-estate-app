import { useEffect, useRef, useState } from 'react';
// import type { GeoPosition } from 'react-native-geolocation-service';

// interface FilterState {
//   priceMin?: number;
//   priceMax?: number;
//   bedrooms?: number;
//   // …any other filters
// }

interface Listing {
  id: string;
  title: string;
  // …
}

interface UseListingsReturn {
  listings: Listing[];
  loading: boolean;
  error: string | null;
}

export const useListings = (
  filters: any,
  location: any | null
): UseListingsReturn => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Don’t fetch until we have a location
    if (!location) return;

    // cancel any in‑flight request before starting a new one
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchAds = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          lat:  String(location.coords.latitude),
          lng:  String(location.coords.longitude),
          min:  String(filters.priceMin ?? ''),
          max:  String(filters.priceMax ?? ''),
          beds: String(filters.bedrooms ?? ''),
        });

        const res = await fetch(
          `https://api.example.com/ads?${params}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setListings(json.data);        // adapt to your API shape
      } catch (err: any) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();

    // cleanup when component unmounts
    return () => controller.abort();
  }, [location.coords.latitude, location.coords.longitude, filters.priceMin, filters.priceMax, filters.bedrooms, location]);

  return { listings, loading, error };
};
