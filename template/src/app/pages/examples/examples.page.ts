import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  IonBackButton, IonButtons, IonButton, IonContent, IonHeader,
  IonTitle, IonToolbar,
} from '@ionic/angular';
import { BaseMain } from '../../core/base/base-main';
import { ConnectivityService } from '../../core/services/connectivity.service';
import { FeedbackService } from '../../core/services/feedback.service';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state.component';

@Component({
  selector: 'app-examples',
  standalone: true,
  imports: [
    IonBackButton, IonButtons, IonButton, IonContent, IonHeader, IonTitle,
    IonToolbar, TranslocoPipe, EmptyStateComponent, LoadingStateComponent,
  ],
  templateUrl: './examples.page.html',
  styleUrls: ['./examples.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamplesPage extends BaseMain {
  readonly connectivity = inject(ConnectivityService);
  private readonly feedback = inject(FeedbackService);
  private readonly i18n = inject(TranslocoService);

  async showToast(): Promise<void> {
    await this.feedback.toast(this.i18n.translate('examples.toastMessage'));
  }

  async showConfirmation(): Promise<void> {
    const confirmed = await this.feedback.confirm(
      this.i18n.translate('examples.confirmMessage'),
      this.i18n.translate('examples.confirmTitle'),
    );
    if (confirmed) {
      this.log.d('Example action confirmed');
      await this.feedback.toast(this.i18n.translate('examples.confirmed'));
    }
  }
}
