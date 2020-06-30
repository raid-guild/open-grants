import { TestBed } from '@angular/core/testing';

import { OrbitService } from './orbit.service';

describe('OrbitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrbitService = TestBed.get(OrbitService);
    expect(service).toBeTruthy();
  });
});
