import { isDevMode } from '@angular/core';

/**
 * Project-wide defaults. Consumers should adapt them to their own application.
 * Do not place credentials or other secrets here: this file is bundled in the client.
 */
export class AppConfig {
  private constructor() {}

  static readonly APP_NAME = '__PROJECT_NAME__';
  static readonly LOG_DEBUG = isDevMode();
  static readonly DEFAULT_LANGUAGE = 'es';
  static readonly SUPPORTED_LANGUAGES = ['es', 'en'] as const;
  static readonly TOAST_DURATION_MS = 3000;

  static readonly Routes = {
    HOME: '',
    EXAMPLES: 'examples',
  } as const;
}
