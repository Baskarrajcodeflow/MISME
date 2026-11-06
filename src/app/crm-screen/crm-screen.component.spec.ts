import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmScreenComponent } from './crm-screen.component';

describe('CrmScreenComponent', () => {
  let component: CrmScreenComponent;
  let fixture: ComponentFixture<CrmScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrmScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrmScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
