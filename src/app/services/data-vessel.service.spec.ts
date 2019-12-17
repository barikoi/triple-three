import { TestBed } from '@angular/core/testing';

import { DataVesselService } from './data-vessel.service';

describe('DataVesselService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataVesselService = TestBed.get(DataVesselService);
    expect(service).toBeTruthy();
  });
});
