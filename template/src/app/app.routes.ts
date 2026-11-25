import type { Routes } from '@angular/router';
import { AppConfig } from './app.constants';

export const appRoutes: Routes = [
  {
    path: AppConfig.Routes.HOME,
    loadComponent: () =>
      import('./pages/home/home.page').then((module) => module.HomePage),
  },
  {
    path: AppConfig.Routes.EXAMPLES,
    loadComponent: () =>
      import('./pages/examples/examples.page').then((module) => module.ExamplesPage),
  },
  { path: '**', redirectTo: AppConfig.Routes.HOME },
];
