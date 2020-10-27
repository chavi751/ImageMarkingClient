import { TestBed } from '@angular/core/testing';

import { HttpCommService } from './http-comm.service';

describe('HttpCommService', () => {
  let service: HttpCommService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpCommService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
