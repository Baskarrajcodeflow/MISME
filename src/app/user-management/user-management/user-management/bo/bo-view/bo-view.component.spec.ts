import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoViewComponent } from './bo-view.component';

describe('BoViewComponent', () => {
  let component: BoViewComponent;
  let fixture: ComponentFixture<BoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
