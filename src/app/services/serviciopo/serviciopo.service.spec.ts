import { TestBed } from '@angular/core/testing';

import { ServiciopoService } from './serviciopo.service';

describe('ServiciopoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiciopoService = TestBed.get(ServiciopoService);
    expect(service).toBeTruthy();
  });
});
