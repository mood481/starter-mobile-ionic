import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { AlertController, ToastController, type ToastOptions } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AppConfig } from '../../app.constants';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private readonly alerts = inject(AlertController);
  private readonly toasts = inject(ToastController);
  private readonly i18n = inject(TranslocoService);

  async toast(message: string, options: ToastOptions = {}): Promise<void> {
    const toast = await this.toasts.create({
      message,
      duration: AppConfig.TOAST_DURATION_MS,
      position: 'bottom',
      ...options,
    });
    await toast.present();
  }

  async alert(message: string, title?: string): Promise<void> {
    const ok = await firstValueFrom(this.i18n.selectTranslate('common.accept'));
    const alert = await this.alerts.create({
      header: title,
      message,
      buttons: [{ text: ok }],
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  async confirm(message: string, title?: string): Promise<boolean> {
    const [cancel, accept] = await Promise.all([
      firstValueFrom(this.i18n.selectTranslate('common.cancel')),
      firstValueFrom(this.i18n.selectTranslate('common.accept')),
    ]);
    const alert = await this.alerts.create({
      header: title,
      message,
      buttons: [
        { text: cancel, role: 'cancel' },
        { text: accept, role: 'confirm' },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'confirm';
  }
}
