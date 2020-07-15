import { TestBed } from '@angular/core/testing';
import { ThreeBoxService } from './threeBox.service';

describe('3boxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThreeBoxService = TestBed.get(ThreeBoxService);
    expect(service).toBeTruthy();
  });
});
