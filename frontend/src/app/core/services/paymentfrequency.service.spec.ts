import { TestBed } from '@angular/core/testing';

import { PaymentfrequencyService } from './paymentfrequency.service';

describe('PaymentfrequencyService', () => {
  let service: PaymentfrequencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentfrequencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
