import { TestBed } from '@angular/core/testing';

import { DynamicExportServiceService } from './dynamic-export-service.service';

describe('DynamicExportServiceService', () => {
  let service: DynamicExportServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicExportServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
