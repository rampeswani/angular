import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerForm1Component } from './customer-form1.component';

describe('CustomerForm1Component', () => {
  let component: CustomerForm1Component;
  let fixture: ComponentFixture<CustomerForm1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerForm1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerForm1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
