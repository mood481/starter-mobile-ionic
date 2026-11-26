import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { GlobalErrorHandler } from '../../src/app/core/services/global-error-handler';
import { LoggerService } from '../../src/app/core/services/logger.service';

describe('GlobalErrorHandler', () => {
  it('reports unexpected errors through the shared logger', () => {
    const errorLog = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        {
          provide: LoggerService,
          useValue: {
            get: () => ({ d: vi.fn(), w: vi.fn(), e: errorLog }),
          },
        },
      ],
    });
    const handler = TestBed.inject(GlobalErrorHandler);
    const error = new Error('unexpected');
    handler.handleError(error);
    expect(errorLog).toHaveBeenCalledWith('Unhandled application error', error);

    handler.handleError('unknown failure');
    expect(errorLog).toHaveBeenCalledWith(
      'Unhandled application error',
      expect.objectContaining({ message: 'unknown failure' }),
    );
  });
});
