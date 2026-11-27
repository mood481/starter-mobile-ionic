import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.constants';

export interface ILogger {
  d(...args: unknown[]): void;
  w(...args: unknown[]): void;
  e(...args: unknown[]): void;
}

/** A small contextual logger, with debug output disabled in production. */
@Injectable({ providedIn: 'root' })
export class LoggerService {
  get(context: string): ILogger {
    const prefix = `[${context}]`;
    return {
      d: (...args: unknown[]) => {
        if (AppConfig.LOG_DEBUG) {
          console.debug(prefix, ...args);
        }
      },
      w: (...args: unknown[]) => console.warn(prefix, ...args),
      e: (...args: unknown[]) => console.error(prefix, ...args),
    };
  }
}
