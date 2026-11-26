import { inject, Injectable, InjectionToken } from '@angular/core';

/** Async contract so the storage backend can be replaced without changing callers. */
export interface StorageAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

/** Default browser adapter. Can be replaced by Capacitor Preferences in app providers. */
export class LocalStorageAdapter implements StorageAdapter {
  async get(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  }

  async set(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  }
}

export const STORAGE_ADAPTER = new InjectionToken<StorageAdapter>('STORAGE_ADAPTER', {
  providedIn: 'root',
  factory: () => new LocalStorageAdapter(),
});

/**
 * Minimal JSON storage. T is a compile-time type only, not runtime validation.
 * A missing key returns null; invalid JSON and unavailable storage reject.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly adapter = inject(STORAGE_ADAPTER);

  async get<T>(key: string): Promise<T | null> {
    const value = await this.adapter.get(key);
    return value === null ? null : JSON.parse(value) as T;
  }

  async set<T>(key: string, value: T): Promise<void> {
    const serialized = JSON.stringify(value);
    if (serialized === undefined) {
      throw new TypeError('Storage value must be JSON-serializable');
    }
    await this.adapter.set(key, serialized);
  }

  remove(key: string): Promise<void> {
    return this.adapter.remove(key);
  }
}
