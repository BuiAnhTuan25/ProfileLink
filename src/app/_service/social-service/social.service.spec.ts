import { TestBed } from '@angular/core/testing';

import { SocialService } from './social.service';

describe('LinksService', () => {
  let service: SocialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
