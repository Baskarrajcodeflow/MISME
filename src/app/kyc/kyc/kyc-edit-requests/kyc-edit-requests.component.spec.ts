import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycEditRequestsComponent } from './kyc-edit-requests.component';

describe('KycEditRequestsComponent', () => {
  let component: KycEditRequestsComponent;
  let fixture: ComponentFixture<KycEditRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KycEditRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KycEditRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
