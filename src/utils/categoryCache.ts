interface CachedData<T> {
  data: T;
  timestamp: number;
}

const CACHE_KEY = "categories_cache";
const CACHE_DURATION = 60 * 60 * 1000; // 1 heure en millisecondes

export const categoryCache = {
  set: <T>(data: T) => {
    const cacheData: CachedData<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  },

  get: <T>(): T | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp }: CachedData<T> = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_DURATION;

      if (isExpired) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  },

  clear: () => {
    localStorage.removeItem(CACHE_KEY);
  },
};
