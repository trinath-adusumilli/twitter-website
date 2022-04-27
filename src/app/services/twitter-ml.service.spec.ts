import { TestBed } from '@angular/core/testing';

import { TwitterMlService } from './twitter-ml.service';

describe('TwitterMlService', () => {
  let service: TwitterMlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TwitterMlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
