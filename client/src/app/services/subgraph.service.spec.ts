import { TestBed } from '@angular/core/testing';

import { SubgraphService } from './subgraph.service';

describe('SubgraphService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubgraphService = TestBed.get(SubgraphService);
    expect(service).toBeTruthy();
  });
});
