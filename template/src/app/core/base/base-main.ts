import { inject } from '@angular/core';
import { LoggerService, type ILogger } from '../services/logger.service';

/**
 * Optional plain base class for Angular DI-created components and services.
 * Field injection is evaluated in the creation injection context.
 */
export abstract class BaseMain {
  protected readonly log: ILogger = inject(LoggerService).get(this.constructor.name);
}
