import { TestBed } from '@angular/core/testing';

import { SnkimgService } from './snkimg.service';

describe('SnkimgService', () => {
  let service: SnkimgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnkimgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
