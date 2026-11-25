import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IonSpinner } from '@ionic/angular';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [IonSpinner],
  template: `
    <div class="loading-state" role="status" aria-live="polite">
      <ion-spinner name="crescent" aria-hidden="true" />
      @if (label()) {
        <span>{{ label() }}</span>
      }
    </div>
  `,
  styles: [`
    .loading-state { display: flex; align-items: center; justify-content: center; gap: .75rem; padding: 1.5rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingStateComponent {
  readonly label = input('');
}
