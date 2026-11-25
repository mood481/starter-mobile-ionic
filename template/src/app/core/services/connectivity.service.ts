import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Network } from '@capacitor/network';
import { BaseMain } from '../base/base-main';

export type ConnectivityStatus = 'unknown' | 'online' | 'offline';

@Injectable({ providedIn: 'root' })
export class ConnectivityService extends BaseMain {
  private readonly destroyRef = inject(DestroyRef);
  private readonly state = signal<ConnectivityStatus>('unknown');

  readonly status = this.state.asReadonly();
  readonly isOnline = computed(() => this.state() === 'online');

  constructor() {
    super();
    void this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      const listener = await Network.addListener('networkStatusChange', ({ connected }) => {
        this.state.set(connected ? 'online' : 'offline');
      });
      if (this.destroyRef.destroyed) {
        await listener.remove();
        return;
      }
      this.destroyRef.onDestroy(() => { void listener.remove(); });
      const { connected } = await Network.getStatus();
      if (!this.destroyRef.destroyed) this.state.set(connected ? 'online' : 'offline');
    } catch (error) {
      this.log.w('Unable to read network status', error);
    }
  }
}
