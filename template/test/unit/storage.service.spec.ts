import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  STORAGE_ADAPTER, type StorageAdapter, StorageService,
} from '../../src/app/core/services/storage.service';

describe('StorageService', () => {
  let storage: StorageService;
  let stored: Map<string, string>;
  let adapter: StorageAdapter;

  beforeEach(() => {
    stored = new Map<string, string>();
    adapter = {
      get: async (key) => stored.get(key) ?? null,
      set: async (key, value) => { stored.set(key, value); },
      remove: async (key) => { stored.delete(key); },
    };
    TestBed.configureTestingModule({
      providers: [{ provide: STORAGE_ADAPTER, useValue: adapter }],
    });
    storage = TestBed.inject(StorageService);
  });

  it('returns null for missing keys', async () => {
    await expect(storage.get<{ enabled: boolean }>('missing')).resolves.toBeNull();
  });

  it('round trips objects, primitives and arrays through JSON', async () => {
    const settings = { enabled: true, attempts: 3, tags: ['mobile'] };
    await storage.set('settings', settings);
    expect(stored.get('settings')).toBe(JSON.stringify(settings));
    await expect(storage.get<typeof settings>('settings')).resolves.toEqual(settings);
    await storage.set('empty-string', '');
    await expect(storage.get<string>('empty-string')).resolves.toBe('');
    await storage.set('false', false);
    await expect(storage.get<boolean>('false')).resolves.toBe(false);
  });

  it('removes keys', async () => {
    await storage.set('key', 5);
    await storage.remove('key');
    await expect(storage.get<number>('key')).resolves.toBeNull();
  });

  it('rejects corrupt JSON rather than silently dropping data', async () => {
    stored.set('broken', '{invalid');
    await expect(storage.get('broken')).rejects.toThrow(SyntaxError);
  });

  it('rejects unsupported values before writing', async () => {
    await expect(storage.set('invalid', undefined)).rejects.toThrow(TypeError);
    expect(stored.has('invalid')).toBe(false);
  });
});
