import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <h2>{{ title() }}</h2>
      @if (description()) {
        <p>{{ description() }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: [`
    .empty-state { padding: 1.5rem; text-align: center; }
    h2 { margin: 0 0 .5rem; font-size: 1.1rem; }
    p { margin: 0; color: var(--ion-color-medium); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input('');
}
