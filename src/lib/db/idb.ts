/**
 * Minimal promise wrapper over IndexedDB. Dependency-free on purpose: the
 * surface is three object stores and a handful of calls, so a library would
 * cost more bytes than it saves.
 *
 * Schema (bump DB_VERSION and extend `upgrade` to migrate):
 *   v1  events   autoIncrement id; indexes: ts, day, type
 *       backups  keyPath day (YYYY-MM-DD)
 *       meta     keyPath key
 *
 * Every call resolves to a safe fallback when IndexedDB is missing or blocked
 * (private windows, locked-down browsers), so callers never need a try/catch.
 */

const DB_NAME = 'tba-academy';
const DB_VERSION = 1;

export type StoreName = 'events' | 'backups' | 'meta';

let dbPromise: Promise<IDBDatabase | null> | null = null;

function upgrade(db: IDBDatabase, oldVersion: number): void {
  if (oldVersion < 1) {
    const events = db.createObjectStore('events', { keyPath: 'id', autoIncrement: true });
    events.createIndex('ts', 'ts');
    events.createIndex('day', 'day');
    events.createIndex('type', 'type');
    db.createObjectStore('backups', { keyPath: 'day' });
    db.createObjectStore('meta', { keyPath: 'key' });
  }
}

export function openDb(): Promise<IDBDatabase | null> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') return resolve(null);
    let req: IDBOpenDBRequest;
    try {
      req = indexedDB.open(DB_NAME, DB_VERSION);
    } catch {
      return resolve(null);
    }
    req.onupgradeneeded = (e) => upgrade(req.result, e.oldVersion);
    req.onsuccess = () => {
      const db = req.result;
      // Another tab upgraded the schema: release our handle so it can proceed.
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };
    req.onerror = () => resolve(null);
    req.onblocked = () => resolve(null);
  });
  return dbPromise;
}

function done<T>(req: IDBRequest<T>, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(fallback);
  });
}

async function withStore<T>(
  name: StoreName,
  mode: IDBTransactionMode,
  fallback: T,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb();
  if (!db) return fallback;
  try {
    return await done(run(db.transaction(name, mode).objectStore(name)), fallback);
  } catch {
    return fallback;
  }
}

export const idb = {
  /** True when a database handle could be opened. */
  async available(): Promise<boolean> {
    return (await openDb()) !== null;
  },
  getAll<T>(name: StoreName): Promise<T[]> {
    return withStore<T[]>(name, 'readonly', [], (s) => s.getAll() as IDBRequest<T[]>);
  },
  get<T>(name: StoreName, key: IDBValidKey): Promise<T | undefined> {
    return withStore<T | undefined>(name, 'readonly', undefined, (s) => s.get(key) as IDBRequest<T | undefined>);
  },
  /** Insert or replace. Resolves to the record key, or null on failure. */
  put(name: StoreName, value: unknown): Promise<IDBValidKey | null> {
    return withStore<IDBValidKey | null>(name, 'readwrite', null, (s) => s.put(value) as IDBRequest<IDBValidKey | null>);
  },
  delete(name: StoreName, key: IDBValidKey): Promise<void> {
    return withStore<void>(name, 'readwrite', undefined, (s) => s.delete(key) as IDBRequest<void>);
  },
  clear(name: StoreName): Promise<void> {
    return withStore<void>(name, 'readwrite', undefined, (s) => s.clear() as IDBRequest<void>);
  },
  /** Write many records in one transaction. Resolves false on any failure. */
  async putMany(name: StoreName, values: unknown[]): Promise<boolean> {
    const db = await openDb();
    if (!db || values.length === 0) return db !== null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(name, 'readwrite');
        const store = tx.objectStore(name);
        for (const v of values) store.put(v);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
        tx.onabort = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  },
};
