import { TestBed } from '@angular/core/testing';

import { CovidTrackingService } from './covid-tracking.service';

describe('CovidTrackingService', () => {
  let service: CovidTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CovidTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
