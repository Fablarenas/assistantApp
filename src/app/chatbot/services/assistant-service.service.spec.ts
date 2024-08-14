import { TestBed } from '@angular/core/testing';

import { AssistanServiceService } from './assistan-service.service';

describe('AssistanServiceService', () => {
  let service: AssistanServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssistanServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
