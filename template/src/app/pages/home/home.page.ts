import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { AppConfig } from '../../app.constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, RouterLink, TranslocoPipe],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  readonly appName = AppConfig.APP_NAME;
  readonly examplesPath = `/${AppConfig.Routes.EXAMPLES}`;
}
