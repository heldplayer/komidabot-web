import {TestBed} from '@angular/core/testing';

import {CampusService} from './campus.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('CampusService', () => {
  let service: CampusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CampusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
