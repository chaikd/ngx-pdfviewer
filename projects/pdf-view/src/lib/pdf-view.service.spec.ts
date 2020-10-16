import { TestBed } from '@angular/core/testing';

import { PdfViewService } from './pdf-view.service';

describe('PdfViewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PdfViewService = TestBed.get(PdfViewService);
    expect(service).toBeTruthy();
  });
});
