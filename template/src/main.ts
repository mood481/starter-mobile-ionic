import { provideHttpClient } from '@angular/common/http';
import { ErrorHandler, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { AppConfig } from './app/app.constants';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { TranslocoHttpLoader } from './app/core/i18n/transloco-loader';
import { GlobalErrorHandler } from './app/core/services/global-error-handler';

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    provideBrowserGlobalErrorListeners(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideRouter(appRoutes),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: [...AppConfig.SUPPORTED_LANGUAGES],
        defaultLang: AppConfig.DEFAULT_LANGUAGE,
        fallbackLang: AppConfig.DEFAULT_LANGUAGE,
        reRenderOnLangChange: true,
        prodMode: !AppConfig.LOG_DEBUG,
      },
      loader: TranslocoHttpLoader,
    }),
  ],
}).catch((error: unknown) => {
  console.error('Unable to bootstrap mobile application', error);
});
