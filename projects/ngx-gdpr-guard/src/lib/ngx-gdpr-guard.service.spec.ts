import { TestBed } from '@angular/core/testing';

import { NgxGdprGuardService } from './ngx-gdpr-guard.service';

describe('NgxGdprGuardService', () => {
  let service: NgxGdprGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxGdprGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
