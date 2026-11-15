import { provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    provideRouter(appRoutes),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
}).catch((error: unknown) => {
  console.error('Unable to bootstrap mobile application', error);
});
