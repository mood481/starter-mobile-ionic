import { ErrorHandler, inject, Injectable } from '@angular/core';
import { LoggerService } from './logger.service';

/**
 * Last-resort reporting for unexpected errors.
 * Handle recoverable errors where they occur, not here.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly log = inject(LoggerService).get(GlobalErrorHandler.name);

  handleError(error: unknown): void {
    const normalized = error instanceof Error ? error : new Error(String(error));
    this.log.e('Unhandled application error', normalized);
  }
}
