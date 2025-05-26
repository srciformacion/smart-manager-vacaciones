
// Extend the Window interface to include SyncManager
interface Window {
  SyncManager?: any; // Use 'any' or define SyncManager interface if needed
}

// Extend ServiceWorkerRegistration to include the 'sync' property
interface ServiceWorkerRegistration {
  readonly sync: SyncManager;
}

interface SyncManager {
  register(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}

interface SyncEvent extends ExtendableEvent {
  readonly lastChance: boolean;
  readonly tag: string;
}

interface ServiceWorkerGlobalScopeEventMap {
  sync: SyncEvent;
}

