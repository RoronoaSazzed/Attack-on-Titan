/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VerticalLoaderService } from './vertical-loader.service';

describe('VerticalLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerticalLoaderService]
    });
  });

  it('should ...', inject([VerticalLoaderService], (service: VerticalLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
