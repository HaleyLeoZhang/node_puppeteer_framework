type CacheEngine = 'local' | 'session';

class CacheManager {
  private engine: CacheEngine = 'local';

  setEngine(engine: CacheEngine) {
    this.engine = engine;
  }

  private getStorage(): Storage {
    return this.engine === 'local' ? localStorage : sessionStorage;
  }

  get<T>(key: string): T | null {
    try {
      const data = this.getStorage().getItem(key);
      if (!data) return null;
      const parsed = JSON.parse(data);
      if (parsed.expire && parsed.expire < Date.now()) {
        this.getStorage().removeItem(key);
        return null;
      }
      return parsed.value as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T, ttl: number = 0): void {
    const data = {
      value,
      expire: ttl > 0 ? Date.now() + ttl * 1000 : 0,
    };
    this.getStorage().setItem(key, JSON.stringify(data));
  }

  remove(key: string): void {
    this.getStorage().removeItem(key);
  }

  clear(): void {
    this.getStorage().clear();
  }
}

export const cache = new CacheManager();

export const CACHE_KEYS = {
  MAX_SEQUENCE: (id: number) => `max_chapter_sequence_${id}`,
  HISTORY_READ: (id: number) => `history_read_${id}`,
  CHAPTER_ORDER: 'chapter_order',
  IMAGE_WIDTH: 'image_width',
};
